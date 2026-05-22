import * as Location from "expo-location";
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
  action: string;
  prediction: string;
  db: number;
  gps: string;
  risk: string;
};

export default function SoundPollutionHunter({
  onResult,
}: Props) {
  const [prediction, setPrediction] = useState("");
  const [action, setAction] = useState("");
  const [db, setDb] = useState("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const getRisk = (value: number) => {
    if (value < 30) return "No risk";
    if (value < 60) return "Safe for long periods";
    if (value < 85) return "Fatigue possible";
    if (value < 100) return "Hearing damage possible";
    if (value < 120) return "Serious hearing damage possible";
    return "Immediate hearing damage risk";
  };

  const captureAttempt = async () => {
    const parsedDb = Number(db);

    if (!action.trim() || !parsedDb) {
      Alert.alert(
        "Missing information",
        "Enter action and sound level."
      );
      return;
    }

    let gps = "Unavailable";

    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status === "granted") {
        const location =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const addressResult = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          
          const place = addressResult[0];
          
          const address = place
            ? [
                place.name,
                place.city,
                place.region,
                
              ]
                .filter(Boolean)
                .join(", ")
            : "Address unavailable";
          
          gps = address;
      }
    } catch {}

    const risk = getRisk(parsedDb);

    const newAttempt: Attempt = {
      action,
      prediction,
      db: parsedDb,
      gps,
      risk,
    };

    const updated = [...attempts, newAttempt];
    setAttempts(updated);

    const loudest = updated.reduce((best, item) =>
      item.db > best.db ? item : best
    );

    const summary = [
      `Prediction: ${prediction || "Not entered"}`,
      ...updated.map(
        (item, index) =>
          `${index + 1}. ${item.action} = ${
            item.db
          } dB | Location: ${item.gps} | Risk: ${item.risk}`
      ),
      `Loudest action: ${loudest.action} (${loudest.db} dB)`,
      `Prediction correct: ${
        prediction.toLowerCase() ===
        loudest.action.toLowerCase()
          ? "Yes"
          : "No"
      }`,
    ].join(" | ");

    onResult(summary);

    setAction("");
    setDb("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🔊 Sound Pollution Hunter
      </Text>

      <Text style={styles.info}>
        Measure classroom sound levels, compare
        loudness, map locations, and investigate
        hearing safety.
      </Text>

      <TextInput
        placeholder="Prediction: Which action will be loudest?"
        value={prediction}
        onChangeText={setPrediction}
        style={styles.input}
      />

      <TextInput
        placeholder="Action e.g. dropping book"
        value={action}
        onChangeText={setAction}
        style={styles.input}
      />

      <TextInput
        placeholder="Measured sound level in dB"
        value={db}
        onChangeText={setDb}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={captureAttempt}
      >
        <Text style={styles.buttonText}>
          Save Sound Test
        </Text>
      </TouchableOpacity>

      {attempts.map((item, index) => (
        <View
          key={`${item.action}-${index}`}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>
            Action {index + 1}
          </Text>

          <Text>Action: {item.action}</Text>
          <Text>Sound: {item.db} dB</Text>
          <Text>Location: {item.gps}</Text>
          <Text>Risk: {item.risk}</Text>
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