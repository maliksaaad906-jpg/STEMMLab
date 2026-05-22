import * as ImagePicker from "expo-image-picker";
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
  stage: string;
  design: string;
  videoUri: string;
  height: number;
  fallTime: number;
  stopTime: number;
  mass: number;
  accuracy: string;
  velocity: number;
  acceleration: number;
  netForce: number;
  weight: number;
  dragForce: number;
  gForce: number;
};

const stages = [
  "Baseline: No Parachute",
  "Prototype 1",
  "Prototype 2",
  "Prototype 3",
];

export default function ParachuteChallenge({ onResult }: Props) {
  const [stageIndex, setStageIndex] = useState(0);
  const [prediction, setPrediction] = useState("");
  const [design, setDesign] = useState("");
  const [videoUri, setVideoUri] = useState("");
  const [height, setHeight] = useState("");
  const [fallTime, setFallTime] = useState("");
  const [stopTime, setStopTime] = useState("");
  const [mass, setMass] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow media access to upload video evidence.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const addAttempt = () => {
    const h = Number(height);
    const t = Number(fallTime);
    const stop = Number(stopTime);
    const m = Number(mass);

    if (!h || !t || !m) {
      Alert.alert(
        "Missing data",
        "Enter drop height, fall time, and toy mass before saving."
      );
      return;
    }

    const velocity = h / t;
    const acceleration = velocity / t;
    const netForce = m * acceleration;
    const weight = m * 9.8;
    const dragForce = Math.max(0, weight - netForce);
    const gForce = stop > 0 ? velocity / stop / 9.8 : 0;

    const attempt: Attempt = {
      stage: stages[stageIndex],
      design: stageIndex === 0 ? "No parachute baseline" : design || `Prototype ${stageIndex}`,
      videoUri: videoUri || "No video uploaded",
      height: h,
      fallTime: t,
      stopTime: stop,
      mass: m,
      accuracy: accuracy || "Not recorded",
      velocity,
      acceleration,
      netForce,
      weight,
      dragForce,
      gForce,
    };

    const updated = [...attempts, attempt];
    setAttempts(updated);

    const slowest = updated.reduce((best, item) =>
      item.velocity < best.velocity ? item : best
    );

    const summary = [
      `Prediction: ${prediction || "Not entered"}`,
      ...updated.map(
        (item, index) =>
          `${index + 1}. ${item.stage} | Design: ${item.design} | Video: ${
            item.videoUri !== "No video uploaded" ? "uploaded" : "missing"
          } | Height: ${item.height}m | Fall: ${item.fallTime}s | Stop: ${
            item.stopTime || "not recorded"
          }s | Accuracy: ${item.accuracy} | Velocity: ${item.velocity.toFixed(
            2
          )} m/s | Acceleration: ${item.acceleration.toFixed(
            2
          )} m/s² | Net Force: ${item.netForce.toFixed(
            2
          )} N | Weight: ${item.weight.toFixed(
            2
          )} N | Drag Force: ${item.dragForce.toFixed(
            2
          )} N | G-force: ${item.gForce.toFixed(2)}g`
      ),
      `Slowest/safest design: ${slowest.stage} - ${slowest.design}`,
    ].join(" | ");

    onResult(summary);

    setDesign("");
    setVideoUri("");
    setHeight("");
    setFallTime("");
    setStopTime("");
    setMass("");
    setAccuracy("");

    if (stageIndex < stages.length - 1) {
      setStageIndex(stageIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🪂 Parachute Drop Lab</Text>

      <Text style={styles.info}>
        Record a baseline drop, then redesign and test up to three parachute
        prototypes. Upload video evidence and enter timing data from the video.
        The app calculates velocity, acceleration, force, drag, and g-force.
      </Text>

      <View style={styles.stageBox}>
        <Text style={styles.stageTitle}>{stages[stageIndex]}</Text>
        <Text style={styles.stageSub}>
          Completed {attempts.length} / {stages.length} tests
        </Text>
      </View>

      <TextInput
        placeholder="Prediction: Which parachute design will be best?"
        value={prediction}
        onChangeText={setPrediction}
        style={styles.input}
      />

      {stageIndex > 0 && (
        <TextInput
          placeholder="Sketch/describe design e.g. plastic with four strings"
          value={design}
          onChangeText={setDesign}
          style={styles.input}
        />
      )}

      <TouchableOpacity style={styles.videoButton} onPress={pickVideo}>
        <Text style={styles.buttonText}>
          {videoUri ? "Video Evidence Added ✅" : "Upload Drop Video Evidence"}
        </Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Drop height in metres e.g. 1.2"
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Time to first hit ground in seconds"
        value={fallTime}
        onChangeText={setFallTime}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Time from first hit until stop moving"
        value={stopTime}
        onChangeText={setStopTime}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Toy mass in kg e.g. 0.20"
        value={mass}
        onChangeText={setMass}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Landing accuracy e.g. inside target / 20 cm away"
        value={accuracy}
        onChangeText={setAccuracy}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={addAttempt}>
        <Text style={styles.buttonText}>Save Drop Test + Calculate</Text>
      </TouchableOpacity>

      {attempts.map((item, index) => (
        <View key={`${item.stage}-${index}`} style={styles.card}>
          <Text style={styles.cardTitle}>
            {index + 1}. {item.stage}
          </Text>
          <Text>Design: {item.design}</Text>
          <Text>Video: {item.videoUri !== "No video uploaded" ? "Uploaded" : "Missing"}</Text>
          <Text>Velocity: {item.velocity.toFixed(2)} m/s</Text>
          <Text>Acceleration: {item.acceleration.toFixed(2)} m/s²</Text>
          <Text>Net Force: {item.netForce.toFixed(2)} N</Text>
          <Text>Drag Force: {item.dragForce.toFixed(2)} N</Text>
          <Text>G-force: {item.gForce.toFixed(2)}g</Text>
          <Text>Accuracy: {item.accuracy}</Text>
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
    backgroundColor: "#EEF4FF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },
  stageTitle: {
    fontWeight: "900",
    color: "#1E40AF",
  },
  stageSub: {
    marginTop: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
  },
  videoButton: {
    backgroundColor: "#7C3AED",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
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