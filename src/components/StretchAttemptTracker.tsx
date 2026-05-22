import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onResult: (result: string) => void;
};

export default function StretchAttemptTracker({ onResult }: Props) {
  const [attempt, setAttempt] = useState(1);
  const [tracking, setTracking] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [maxMovement, setMaxMovement] = useState(0);
  const [attempts, setAttempts] = useState<string[]>([]);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    if (tracking) {
      Accelerometer.setUpdateInterval(300);

      subscription = Accelerometer.addListener((data) => {
        const movement = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);

        setMaxMovement((previous) => Math.max(previous, movement));
      });
    }

    return () => subscription?.remove();
  }, [tracking]);

  const startAttempt = () => {
    setMaxMovement(0);
    setStartTime(Date.now());
    setTracking(true);
  };

  const stopAttempt = () => {
    if (!startTime) return;

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const summary = `Attempt ${attempt}: max movement ${maxMovement.toFixed(
      2
    )} in ${duration}s`;

    const updatedAttempts = [...attempts, summary];

    setAttempts(updatedAttempts);
    onResult(updatedAttempts.join(" | "));

    setTracking(false);
    setStartTime(null);

    if (attempt < 3) {
      setAttempt(attempt + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stretch Speed Attempts</Text>

      <Text style={styles.info}>
        Complete three controlled movements. Try to keep movement smooth and
        vibration low.
      </Text>

      <Text style={styles.attempt}>Current Attempt: {attempt} / 3</Text>
      <Text style={styles.summary}>Max Movement: {maxMovement.toFixed(2)}</Text>

      <TouchableOpacity
        style={[styles.button, tracking && styles.stopButton]}
        onPress={tracking ? stopAttempt : startAttempt}
        disabled={attempt > 3}
      >
        <Text style={styles.buttonText}>
          {tracking ? "Stop Attempt" : "Start Attempt"}
        </Text>
      </TouchableOpacity>

      {attempts.map((item) => (
        <Text key={item} style={styles.resultText}>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginTop: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    color: "#555",
    lineHeight: 21,
    marginBottom: 12,
  },
  attempt: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  summary: {
    color: "#16A34A",
    fontWeight: "bold",
    marginBottom: 12,
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
    fontWeight: "bold",
  },
  resultText: {
    marginTop: 10,
    color: "#444",
    lineHeight: 20,
  },
});