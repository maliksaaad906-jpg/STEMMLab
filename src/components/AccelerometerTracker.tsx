import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onResult: (result: string) => void;
};

export default function AccelerometerTracker({ onResult }: Props) {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [tracking, setTracking] = useState(false);
  const [maxMovement, setMaxMovement] = useState(0);

  useEffect(() => {
    let subscription: any;

    if (tracking) {
      Accelerometer.setUpdateInterval(300);

      subscription = Accelerometer.addListener((data) => {
        setData(data);

        const movement =
          Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);

        if (movement > maxMovement) {
          setMaxMovement(movement);
          onResult(`Max movement: ${movement.toFixed(2)}`);
        }
      });
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [tracking, maxMovement]);

  const startTracking = () => {
    setMaxMovement(0);
    setTracking(true);
  };

  const stopTracking = () => {
    setTracking(false);
    onResult(`Final max movement: ${maxMovement.toFixed(2)}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Motion Tracking</Text>

      <Text style={styles.value}>X: {x.toFixed(2)}</Text>
      <Text style={styles.value}>Y: {y.toFixed(2)}</Text>
      <Text style={styles.value}>Z: {z.toFixed(2)}</Text>

      <Text style={styles.summary}>
        Max Movement: {maxMovement.toFixed(2)}
      </Text>

      <TouchableOpacity
        style={[styles.button, tracking && styles.stopButton]}
        onPress={tracking ? stopTracking : startTracking}
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
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  summary: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 12,
    color: "#16A34A",
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
});