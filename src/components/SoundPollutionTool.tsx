import * as Location from "expo-location";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  onResult: (result: string) => void;
};

export default function SoundPollutionTool({ onResult }: Props) {
  const [soundLevel, setSoundLevel] = useState("");
  const [action, setAction] = useState("");
  const [gps, setGps] = useState("");

  const captureGps = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const gpsText = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;

    setGps(gpsText);
  };

  const saveMeasurement = () => {
    if (!soundLevel.trim() || !action.trim()) {
      Alert.alert("Missing information", "Enter the action and sound level.");
      return;
    }

    const summary = `Action: ${action} | Sound Level: ${soundLevel} dB | GPS: ${
      gps || "Not captured"
    }`;

    onResult(summary);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sound Measurement</Text>

      <TextInput
        placeholder="Action e.g. Dropping book"
        value={action}
        onChangeText={setAction}
        style={styles.input}
      />

      <TextInput
        placeholder="Sound level in dB e.g. 72"
        value={soundLevel}
        onChangeText={setSoundLevel}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.gpsButton} onPress={captureGps}>
        <Text style={styles.buttonText}>Capture GPS Location</Text>
      </TouchableOpacity>

      {gps ? <Text style={styles.gpsText}>GPS: {gps}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={saveMeasurement}>
        <Text style={styles.buttonText}>Use This Sound Result</Text>
      </TouchableOpacity>
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
    fontWeight: "900",
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
  gpsButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
  gpsText: {
    color: "#555",
    marginBottom: 10,
  },
});