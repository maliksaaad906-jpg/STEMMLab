import { useState } from "react";
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
  material: string;
  distance: string;
  bendAngle: number;
  notes: string;
  stiffness: number;
  estimatedForce: number;
};

const getStiffness = (material: string) => {
  const value = material.toLowerCase();

  if (value.includes("thin paper")) return 0.05;
  if (value.includes("printer")) return 0.05;
  if (value.includes("card stock")) return 0.2;
  if (value.includes("thin cardboard")) return 0.5;
  if (value.includes("corrugated")) return 2.5;
  if (value.includes("cardboard")) return 0.5;

  return 0.1;
};

export default function HandFanChallenge({ onResult }: Props) {
  const [prediction, setPrediction] = useState("");
  const [design, setDesign] = useState("");
  const [material, setMaterial] = useState("");
  const [distance, setDistance] = useState("");
  const [bendAngle, setBendAngle] = useState("");
  const [notes, setNotes] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const addAttempt = () => {
    const angle = Number(bendAngle);

    if (!design.trim() || !material.trim() || !distance.trim() || !angle) {
      Alert.alert(
        "Missing information",
        "Enter fan design, material, distance, and bend angle."
      );
      return;
    }

    const stiffness = getStiffness(material);
    const radians = angle * (Math.PI / 180);
    const estimatedForce = stiffness * radians;

    const attempt: Attempt = {
      design: design.trim(),
      material: material.trim(),
      distance: distance.trim(),
      bendAngle: angle,
      notes: notes.trim() || "No notes",
      stiffness,
      estimatedForce,
    };

    const updated = [...attempts, attempt];
    setAttempts(updated);

    const greatestBend = updated.reduce((best, item) =>
      item.bendAngle > best.bendAngle ? item : best
    );

    const summary = [
      `Prediction: ${prediction || "Not entered"}`,
      ...updated.map(
        (item, index) =>
          `${index + 1}. Design: ${item.design} | Material: ${
            item.material
          } | Distance: ${item.distance}cm | Bend: ${
            item.bendAngle
          }° | Stiffness k: ${item.stiffness} N/rad | Estimated force: ${item.estimatedForce.toFixed(
            3
          )} N | Notes: ${item.notes}`
      ),
      `Most movement: ${greatestBend.design} (${greatestBend.bendAngle}° bend)`,
    ].join(" | ");

    onResult(summary);

    setDesign("");
    setMaterial("");
    setDistance("");
    setBendAngle("");
    setNotes("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌬️ Hand Fan Lab</Text>

      <Text style={styles.info}>
        Test fan designs at different distances and compare how much paper or
        cardboard bends. The app estimates force using material stiffness and
        bend angle.
      </Text>

      <TextInput
        placeholder="Prediction: Which fan design will move the paper most?"
        value={prediction}
        onChangeText={setPrediction}
        style={styles.input}
      />

      <TextInput
        placeholder="Fan design e.g. folded fan / flat cardboard"
        value={design}
        onChangeText={setDesign}
        style={styles.input}
      />

      <TextInput
        placeholder="Material e.g. thin paper / cardboard"
        value={material}
        onChangeText={setMaterial}
        style={styles.input}
      />

      <TextInput
        placeholder="Distance in cm e.g. 15, 30, 45"
        value={distance}
        onChangeText={setDistance}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Bend angle in degrees e.g. 30"
        value={bendAngle}
        onChangeText={setBendAngle}
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

      <TouchableOpacity style={styles.button} onPress={addAttempt}>
        <Text style={styles.buttonText}>Save Fan Test + Calculate</Text>
      </TouchableOpacity>

      {attempts.map((attempt, index) => (
        <View key={`${attempt.design}-${index}`} style={styles.card}>
          <Text style={styles.cardTitle}>Design {index + 1}</Text>
          <Text>Fan Design: {attempt.design}</Text>
          <Text>Material: {attempt.material}</Text>
          <Text>Distance: {attempt.distance}cm</Text>
          <Text>Bend Angle: {attempt.bendAngle}°</Text>
          <Text>Stiffness k: {attempt.stiffness} N/rad</Text>
          <Text>Estimated Force: {attempt.estimatedForce.toFixed(3)} N</Text>
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
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
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