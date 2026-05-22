import * as Location from "expo-location";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onResult: (result: string) => void;
};

export default function GpsCapture({ onResult }: Props) {
  const [locationText, setLocationText] = useState("");
  const [loading, setLoading] = useState(false);

  const captureLocation = async () => {
    try {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const result = `GPS Location: ${location.coords.latitude.toFixed(
        6
      )}, ${location.coords.longitude.toFixed(6)} | Accuracy: ${
        location.coords.accuracy?.toFixed(1) ?? "Unknown"
      }m`;

      setLocationText(result);
      onResult(result);
    } catch (error: any) {
      Alert.alert("GPS Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sound Location Capture</Text>

      <Text style={styles.info}>
        Capture GPS coordinates for where the sound measurement was taken.
      </Text>

      <TouchableOpacity style={styles.button} onPress={captureLocation}>
        <Text style={styles.buttonText}>
          {loading ? "Capturing..." : "Capture GPS Location"}
        </Text>
      </TouchableOpacity>

      {locationText ? <Text style={styles.result}>{locationText}</Text> : null}
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
    marginBottom: 8,
  },
  info: {
    color: "#555",
    lineHeight: 21,
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
  result: {
    marginTop: 12,
    color: "#444",
    lineHeight: 20,
  },
});