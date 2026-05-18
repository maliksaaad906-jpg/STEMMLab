import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AccelerometerScreen() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    Accelerometer.setUpdateInterval(500);

    const subscription = Accelerometer.addListener((data) => {
      setData(data);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accelerometer Sensor</Text>

      <View style={styles.card}>
        <Text style={styles.label}>X Axis</Text>
        <Text style={styles.value}>{x.toFixed(2)}</Text>

        <Text style={styles.label}>Y Axis</Text>
        <Text style={styles.value}>{y.toFixed(2)}</Text>

        <Text style={styles.label}>Z Axis</Text>
        <Text style={styles.value}>{z.toFixed(2)}</Text>
      </View>

      <Text style={styles.info}>
        Move or tilt your device to see sensor changes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
  },
  label: {
    fontSize: 18,
    color: "#2563EB",
    marginTop: 12,
    fontWeight: "bold",
  },
  value: {
    fontSize: 24,
    marginTop: 4,
  },
  info: {
    marginTop: 24,
    textAlign: "center",
    color: "#555",
  },
});