import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  onResult: (result: string) => void;
};

const phases = ["Dominant Hand", "Non-Dominant Hand", "Tracing Challenge"];

type Attempt = {
  phase: string;
  value: number;
  unit: "ms" | "accuracy %";
};

export default function ReactionBoardLab({ onResult }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [active, setActive] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [message, setMessage] = useState("Press Start to begin");

  const [traceStarted, setTraceStarted] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  const targetX = useRef(new Animated.Value(0)).current;
  const latestAccuracyRef = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (waiting) {
      const delay = Math.random() * 3000 + 1000;

      timer = setTimeout(() => {
        setActive(true);
        setWaiting(false);
        setStartTime(Date.now());
        setMessage("TAP NOW!");
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [waiting]);

  useEffect(() => {
    if (phaseIndex !== 2) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(targetX, {
          toValue: 220,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(targetX, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [phaseIndex, targetX]);

  const updateSummary = (updatedAttempts: Attempt[]) => {
    const reactionAttempts = updatedAttempts.filter((item) => item.unit === "ms");

    const fastest =
      reactionAttempts.length > 0
        ? reactionAttempts.reduce((best, item) =>
            item.value < best.value ? item : best
          )
        : null;

    const summary = [
      ...updatedAttempts.map(
        (item, index) => `${index + 1}. ${item.phase}: ${item.value} ${item.unit}`
      ),
      fastest
        ? `Fastest reaction: ${fastest.phase} (${fastest.value} ms)`
        : "",
    ]
      .filter(Boolean)
      .join(" | ");

    onResult(summary);
  };

  const startChallenge = () => {
    if (phaseIndex === 2) {
      Alert.alert(
        "Tracing Challenge",
        "Follow the moving yellow circle with your finger. Release to save your accuracy score."
      );
      return;
    }

    setWaiting(true);
    setActive(false);
    setMessage("Wait for green...");
  };

  const handleTap = () => {
    if (!active) {
      Alert.alert("Too early!", "Wait for the signal before tapping.");
      return;
    }

    const reaction = Date.now() - startTime;

    const attempt: Attempt = {
      phase: phases[phaseIndex],
      value: reaction,
      unit: "ms",
    };

    const updated = [...attempts, attempt];

    setAttempts(updated);
    updateSummary(updated);

    setMessage(`Reaction Recorded: ${reaction} ms`);
    setActive(false);

    if (phaseIndex < phases.length - 1) {
      setPhaseIndex(phaseIndex + 1);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => phaseIndex === 2,
    onMoveShouldSetPanResponder: () => phaseIndex === 2,

    onPanResponderGrant: () => {
      if (phaseIndex !== 2) return;

      setTraceStarted(true);
      setAccuracy(100);
      latestAccuracyRef.current = 100;
      setMessage("Tracing started");
    },

    onPanResponderMove: (_, gestureState) => {
      if (phaseIndex !== 2 || !traceStarted) return;

      targetX.stopAnimation((currentX: number) => {
        const targetScreenX = currentX + 40;
        const difference = Math.abs(gestureState.x0 + gestureState.dx - targetScreenX);

        const nextAccuracy = Math.max(0, Math.round(100 - difference / 3));

        latestAccuracyRef.current = nextAccuracy;
        setAccuracy(nextAccuracy);
      });
    },

    onPanResponderRelease: () => {
      if (phaseIndex !== 2) return;

      const finalAccuracy = latestAccuracyRef.current;

      const attempt: Attempt = {
        phase: "Tracing Challenge",
        value: finalAccuracy,
        unit: "accuracy %",
      };

      const updated = [...attempts, attempt];

      setAttempts(updated);
      updateSummary(updated);

      setMessage(`Tracing Accuracy: ${finalAccuracy}%`);
      setTraceStarted(false);
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Reaction Board Lab</Text>

      <Text style={styles.info}>
        Compare reaction speed using your dominant hand, non-dominant hand, and
        a finger tracing coordination challenge.
      </Text>

      <View style={styles.phaseBox}>
        <Text style={styles.phaseTitle}>Current Phase: {phases[phaseIndex]}</Text>
        <Text style={styles.phaseSub}>
          Completed {attempts.length} / {phases.length}
        </Text>
      </View>

      {phaseIndex === 2 ? (
        <View style={styles.traceArea} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.target,
              {
                transform: [{ translateX: targetX }],
              },
            ]}
          />

          <Text style={styles.traceScore}>Accuracy: {Math.round(accuracy)}%</Text>

          <Text style={styles.traceHint}>
            Follow the moving circle with your finger
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.reactionArea, active && styles.activeArea]}
          onPress={handleTap}
        >
          <Text style={styles.reactionText}>{message}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.startButton} onPress={startChallenge}>
        <Text style={styles.buttonText}>
          {phaseIndex === 2 ? "Tracing Instructions" : "Start Reaction Test"}
        </Text>
      </TouchableOpacity>

      {attempts.map((item, index) => (
        <View key={`${item.phase}-${index}`} style={styles.card}>
          <Text style={styles.cardTitle}>{item.phase}</Text>
          <Text>
            Result: {item.value} {item.unit}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 18,
    marginTop: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  info: {
    color: "#555",
    lineHeight: 21,
    marginBottom: 12,
  },
  phaseBox: {
    backgroundColor: "#FEF3C7",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },
  phaseTitle: {
    fontWeight: "900",
    color: "#92400E",
  },
  phaseSub: {
    marginTop: 4,
    color: "#555",
  },
  reactionArea: {
    height: 180,
    borderRadius: 18,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  activeArea: {
    backgroundColor: "#16A34A",
  },
  traceArea: {
    height: 180,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  target: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FBBF24",
    position: "absolute",
    top: 45,
    left: 20,
  },
  reactionText: {
    color: "white",
    fontWeight: "900",
    fontSize: 22,
    textAlign: "center",
  },
  traceScore: {
    color: "white",
    marginTop: 55,
    fontWeight: "900",
    fontSize: 22,
  },
  traceHint: {
    color: "white",
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
  },
  card: {
    marginTop: 14,
    backgroundColor: "#F1F5F9",
    padding: 14,
    borderRadius: 14,
  },
  cardTitle: {
    fontWeight: "900",
    marginBottom: 6,
  },
});