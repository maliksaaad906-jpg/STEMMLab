import { Audio } from "expo-av";
import * as Location from "expo-location";
import { useRef, useState } from "react";
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
  soundLevel: number;
  gps: string;
};

export default function SoundPollutionHunter({ onResult }: Props) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [prediction, setPrediction] = useState("");
  const [action, setAction] = useState("");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [recording, setRecording] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const startMeasuring = async () => {
    if (!action.trim()) {
      Alert.alert("Missing action", "Enter the sound action first.");
      return;
    }

    const permission = await Audio.requestPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission denied", "Microphone permission is required.");
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recordingObject = new Audio.Recording();

    await recordingObject.prepareToRecordAsync({
      android: {
        extension: ".m4a",
        outputFormat: 2,
        audioEncoder: 3,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        meteringEnabled: true,
      },
      ios: {
        extension: ".m4a",
        audioQuality: 2,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
        meteringEnabled: true,
      },
    } as any);

    await recordingObject.startAsync();
    recordingRef.current = recordingObject;
    setRecording(true);

    intervalRef.current = setInterval(async () => {
      if (!recordingRef.current) return;

      const status = await recordingRef.current.getStatusAsync();

      if ("metering" in status && typeof status.metering === "number") {
        const approxDb = Math.max(0, Math.round(status.metering + 160));
        setCurrentLevel(approxDb);
      }
    }, 500);
  };

  const stopAndSaveAttempt = async () => {
    if (!recordingRef.current) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    await recordingRef.current.stopAndUnloadAsync();
    recordingRef.current = null;
    setRecording(false);

    let gps = "GPS not captured";

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        gps = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;
      }
    } catch {
      gps = "GPS unavailable";
    }

    const newAttempt: Attempt = {
      action: action.trim(),
      soundLevel: currentLevel,
      gps,
    };

    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);

    const loudest = updatedAttempts.reduce((highest, item) =>
      item.soundLevel > highest.soundLevel ? item : highest
    );

    const summary = [
      `Prediction: ${prediction || "Not entered"}`,
      ...updatedAttempts.map(
        (item, index) =>
          `Attempt ${index + 1}: ${item.action} = ${item.soundLevel} dB at ${item.gps}`
      ),
      `Loudest action: ${loudest.action} (${loudest.soundLevel} dB)`,
    ].join(" | ");

    onResult(summary);
    setAction("");
    setCurrentLevel(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sound Pollution Hunter</Text>

      <Text style={styles.info}>
        Measure sound from different actions, compare results, and identify the loudest source.
      </Text>

      <TextInput
        placeholder="Prediction: Which action will be loudest?"
        value={prediction}
        onChangeText={setPrediction}
        style={styles.input}
      />

      <TextInput
        placeholder="Action e.g. dropping a book, talking, stamping"
        value={action}
        onChangeText={setAction}
        style={styles.input}
      />

      <Text style={styles.level}>{currentLevel} dB</Text>

      <TouchableOpacity
        style={[styles.button, recording && styles.stopButton]}
        onPress={recording ? stopAndSaveAttempt : startMeasuring}
      >
        <Text style={styles.buttonText}>
          {recording ? "Stop & Save Attempt" : "Start Measuring"}
        </Text>
      </TouchableOpacity>

      {attempts.map((attempt, index) => (
        <View key={`${attempt.action}-${index}`} style={styles.attemptCard}>
          <Text style={styles.attemptTitle}>Attempt {index + 1}</Text>
          <Text>Action: {attempt.action}</Text>
          <Text>Sound Level: {attempt.soundLevel} dB</Text>
          <Text>GPS: {attempt.gps}</Text>
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
  level: {
    fontSize: 42,
    fontWeight: "900",
    color: "#DC2626",
    textAlign: "center",
    marginVertical: 12,
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
  attemptCard: {
    marginTop: 14,
    backgroundColor: "#F1F5F9",
    padding: 14,
    borderRadius: 14,
  },
  attemptTitle: {
    fontWeight: "900",
    marginBottom: 6,
  },
});