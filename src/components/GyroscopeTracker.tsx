import { Gyroscope } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onResult: (result: string) => void;
};

export default function GyroscopeTracker({ onResult }: Props) {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [tracking, setTracking] = useState(false);
  const [maxRotation, setMaxRotation] = useState(0);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    if (tracking) {
      Gyroscope.setUpdateInterval(300);

      subscription = Gyroscope.addListener((data) => {
        setData(data);

        const rotation = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);

        setMaxRotation((previous) => Math.max(previous, rotation));
      });
    }

    return () => subscription?.remove();
  }, [tracking]);

  useEffect(() => {
    if (tracking) {
      onResult(`Max vibration/rotation: ${maxRotation.toFixed(2)}`);
    }
  }, [maxRotation, tracking, onResult]);

  const toggleTracking = () => {
    if (tracking) {
      setTracking(false);
      onResult(`Final max vibration: ${maxRotation.toFixed(2)}`);
    } else {
      setMaxRotation(0);
      setTracking(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earthquake Motion Sensor</Text>

      <Text>X Rotation: {x.toFixed(2)}</Text>
      <Text>Y Rotation: {y.toFixed(2)}</Text>
      <Text>Z Rotation: {z.toFixed(2)}</Text>

      <Text style={styles.summary}>Max Rotation: {maxRotation.toFixed(2)}</Text>

      <TouchableOpacity
        style={[styles.button, tracking && styles.stopButton]}
        onPress={toggleTracking}
      >
        <Text style={styles.buttonText}>
          {tracking ? "Stop Tracking" : "Start Tracking"}
        </Text>
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
    fontWeight: "bold",
    marginBottom: 12,
  },
  summary: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 12,
    color: "#7C3AED",
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
    fontWeight: "bold",
  },
});