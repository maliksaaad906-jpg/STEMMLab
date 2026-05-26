import { Gyroscope } from "expo-sensors";
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

type Attempt = {
  design: string;
  prediction: string;
  movement: number;
  notes: string;
};

export default function EarthquakeStructureLab({ onResult }: Props) {
  const [design, setDesign] = useState("");
  const [prediction, setPrediction] = useState("");
  const [notes, setNotes] = useState("");
  const [tracking, setTracking] = useState(false);
  const [maxMovement, setMaxMovement] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    if (tracking) {
      Gyroscope.setUpdateInterval(300);

      subscription = Gyroscope.addListener((data) => {
        const movement =
          Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);

        setMaxMovement((previous) => Math.max(previous, movement));
      });
    }

    return () => subscription?.remove();
  }, [tracking]);

  const startTracking = () => {
    if (!design.trim()) {
      Alert.alert(
        "Missing design",
        "Describe your earthquake-resistant structure design first."
      );
      return;
    }

    setMaxMovement(0);
    setTracking(true);
  };

  const stopAndSave = () => {
    setTracking(false);

    const attempt: Attempt = {
      design: design.trim(),
      prediction: prediction.trim() || "Not entered",
      movement: maxMovement,
      notes: notes.trim() || "No notes",
    };

    const updated = [...attempts, attempt];
    setAttempts(updated);

    const best = updated.reduce((lowest, item) =>
      item.movement < lowest.movement ? item : lowest
    );

    const summary = [
      ...updated.map(
        (item, index) =>
          `${index + 1}. Design: ${item.design} | Prediction: ${
            item.prediction
          } | Movement score: ${item.movement.toFixed(2)} | Notes: ${item.notes}`
      ),
      `Best earthquake-resistant design: ${best.design} with lowest movement score ${best.movement.toFixed(
        2
      )}`,
    ].join(" | ");

    onResult(summary);

    setDesign("");
    setPrediction("");
    setNotes("");
    setMaxMovement(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏗️ Earthquake Structure Lab</Text>

      <Text style={styles.info}>
        Build a folded paper/cardboard structure, place the phone on top, shake
        the platform, and use the gyroscope to measure vibration.
      </Text>

      <TextInput
        placeholder="Structure design e.g. 4 folds + 4 pillars"
        value={design}
        onChangeText={setDesign}
        style={styles.input}
      />

      <TextInput
        placeholder="Prediction: How much will the phone move?"
        value={prediction}
        onChangeText={setPrediction}
        style={styles.input}
      />

      <Text style={styles.movement}>
        Live Movement Score: {maxMovement.toFixed(2)}
      </Text>

      <TouchableOpacity
        style={[styles.button, tracking && styles.stopButton]}
        onPress={tracking ? stopAndSave : startTracking}
      >
        <Text style={styles.buttonText}>
          {tracking ? "Stop & Save Structure Test" : "Start Vibration Test"}
        </Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Observation notes"
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, styles.notesInput]}
        multiline
      />

      {attempts.map((attempt, index) => (
        <View key={`${attempt.design}-${index}`} style={styles.card}>
          <Text style={styles.cardTitle}>Design {index + 1}</Text>
          <Text>Structure: {attempt.design}</Text>
          <Text>Prediction: {attempt.prediction}</Text>
          <Text>Movement Score: {attempt.movement.toFixed(2)}</Text>
          <Text>Notes: {attempt.notes}</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
  },
  notesInput: {
    height: 90,
    textAlignVertical: "top",
    marginTop: 12,
  },
  movement: {
    fontSize: 18,
    fontWeight: "900",
    color: "#7C3AED",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#7C3AED",
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