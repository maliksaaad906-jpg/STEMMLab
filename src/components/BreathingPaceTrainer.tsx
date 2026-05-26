import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  onResult: (result: string) => void;
};

type Test = {
  stage: string;
  breaths: number;
  movement: number;
  notes: string;
};

const stages = [
  "Resting",
  "After Jogging",
  "After Star Jumps",
];

export default function BreathingPaceTrainer({
  onResult,
}: Props) {
  const [stageIndex, setStageIndex] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [movement, setMovement] = useState(0);
  const [breaths, setBreaths] = useState("");
  const [notes, setNotes] = useState("");
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    if (tracking) {
      Accelerometer.setUpdateInterval(300);

      subscription = Accelerometer.addListener((data) => {
        const total =
          Math.abs(data.x) +
          Math.abs(data.y) +
          Math.abs(data.z);

        setMovement((previous) =>
          Math.max(previous, total)
        );
      });
    }

    return () => subscription?.remove();
  }, [tracking]);

  const startTracking = () => {
    setMovement(0);
    setTracking(true);
  };

  const stopAndSave = () => {
    const parsedBreaths = Number(breaths);

    if (!parsedBreaths) {
      Alert.alert(
        "Missing breaths",
        "Enter breaths per minute before saving."
      );
      return;
    }

    setTracking(false);

    const test: Test = {
      stage: stages[stageIndex],
      breaths: parsedBreaths,
      movement,
      notes: notes.trim() || "No notes",
    };

    const updated = [...tests, test];
    setTests(updated);

    const highest = updated.reduce((best, item) =>
      item.breaths > best.breaths ? item : best
    );

    const summary = [
      ...updated.map(
        (item, index) =>
          `${index + 1}. ${item.stage} | Breathing: ${
            item.breaths
          } bpm | Chest movement score: ${item.movement.toFixed(
            2
          )} | Notes: ${item.notes}`
      ),
      `Highest breathing rate: ${highest.stage} (${highest.breaths} bpm)`,
    ].join(" | ");

    onResult(summary);

    setBreaths("");
    setNotes("");
    setMovement(0);

    if (stageIndex < stages.length - 1) {
      setStageIndex(stageIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🫁 Breathing Pace Trainer
      </Text>

      <Text style={styles.info}>
        Place the phone on your chest and compare
        breathing rate before and after exercise.
      </Text>

      <View style={styles.stageBox}>
        <Text style={styles.stageTitle}>
          Current Test: {stages[stageIndex]}
        </Text>

        <Text style={styles.stageSub}>
          Completed {tests.length} / {stages.length}
        </Text>
      </View>

      <Text style={styles.liveMovement}>
        Chest Movement Score: {movement.toFixed(2)}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          tracking && styles.stopButton,
        ]}
        onPress={
          tracking ? stopAndSave : startTracking
        }
      >
        <Text style={styles.buttonText}>
          {tracking
            ? "Stop & Save Breathing Test"
            : "Start Chest Tracking"}
        </Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Breaths per minute e.g. 18"
        value={breaths}
        onChangeText={setBreaths}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Observation notes"
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, styles.notesInput]}
        multiline
      />

      {tests.map((item, index) => (
        <View
          key={`${item.stage}-${index}`}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>
            {item.stage}
          </Text>

          <Text>
            Breathing Rate: {item.breaths} bpm
          </Text>

          <Text>
            Chest Movement: {item.movement.toFixed(2)}
          </Text>

          <Text>Notes: {item.notes}</Text>
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

  stageBox: {
    backgroundColor: "#DCFCE7",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },

  stageTitle: {
    fontWeight: "900",
    color: "#166534",
  },

  stageSub: {
    marginTop: 4,
    color: "#555",
  },

  liveMovement: {
    fontSize: 18,
    fontWeight: "900",
    color: "#16A34A",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    backgroundColor: "#F9FAFB",
  },

  notesInput: {
    height: 90,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 12,
  },

  stopButton: {
    backgroundColor: "#DC2626",
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