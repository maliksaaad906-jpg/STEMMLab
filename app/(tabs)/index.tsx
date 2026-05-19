import { router } from "expo-router";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { activities } from "../../src/data/activities";

export default function HomeScreen() {

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const results = await Promise.all([
        fetchActivities(),
        fetchNotifications(),
        fetchHistory(),
      ]);

      console.log("Parallel Programming Results:", results);
    } catch (error) {
      console.log("Parallel Programming Error:", error);
    }
  };

  const fetchActivities = async () => {
    return "Activities Loaded";
  };

  const fetchNotifications = async () => {
    return "Notifications Loaded";
  };

  const fetchHistory = async () => {
    return "History Loaded";
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>STEMM Lab</Text>

      <Text style={styles.subtitle}>
        Choose an activity to begin
      </Text>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => router.push("/history" as any)}
      >
        <Text style={styles.buttonText}>
          View Activity History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => router.push("/map" as any)}
      >
        <Text style={styles.buttonText}>
          View GPS Map
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sensorButton}
        onPress={() => router.push("/accelerometer" as any)}
      >
        <Text style={styles.buttonText}>
          Open Accelerometer Sensor
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.gyroButton}
        onPress={() => router.push("/gyroscope" as any)}
      >
        <Text style={styles.buttonText}>
          Open Gyroscope Sensor
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/notifications" as any)}
        style={styles.notificationButton}
      >
        <Text style={styles.buttonText}>
          Open Notifications
        </Text>
      </TouchableOpacity>

      {activities.map((activity) => (
        <TouchableOpacity
          key={activity.id}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/activity/[id]" as any,
              params: { id: activity.id },
            })
          }
        >
          <Text style={styles.cardTitle}>
            {activity.title}
          </Text>

          <Text style={styles.category}>
            {activity.category}
          </Text>

          <Text style={styles.description}>
            {activity.description}
          </Text>

          <Text style={styles.difficulty}>
            Difficulty: {activity.difficulty}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },

  historyButton: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  mapButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  sensorButton: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  gyroButton: {
    backgroundColor: "#7C3AED",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  notificationButton: {
    backgroundColor: "#F97316",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  category: {
    color: "#2563EB",
    marginTop: 6,
    fontWeight: "600",
  },

  description: {
    color: "#555",
    marginTop: 8,
    lineHeight: 20,
  },

  difficulty: {
    marginTop: 10,
    fontWeight: "600",
  },
});