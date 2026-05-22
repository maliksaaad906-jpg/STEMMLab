import { router } from "expo-router";
import { useEffect } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { activities } from "../../src/data/activities";

export default function HomeScreen() {
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        fetchActivities(),
        fetchNotifications(),
        fetchHistory(),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchActivities = async () => "Activities Loaded";
  const fetchNotifications = async () => "Notifications Loaded";
  const fetchHistory = async () => "History Loaded";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#2563EB", "#1E40AF"]}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>
          🔬 STEMM Lab
        </Text>

        <Text style={styles.heroSubtitle}>
          Interactive STEM activities powered by real mobile sensors.
        </Text>
      </LinearGradient>

      <Text style={styles.sectionTitle}>
        Quick Stats
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="flask" size={28} color="#2563EB" />
          <Text style={styles.statNumber}>
            {activities.length}
          </Text>
          <Text style={styles.statLabel}>
            Activities
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="hardware-chip" size={28} color="#16A34A" />
          <Text style={styles.statNumber}>
            5+
          </Text>
          <Text style={styles.statLabel}>
            Sensors
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="cloud-done" size={28} color="#7C3AED" />
          <Text style={styles.statNumber}>
            Live
          </Text>
          <Text style={styles.statLabel}>
            Firebase
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Device Features
      </Text>

      <View style={styles.featureGrid}>
        <FeatureButton
          icon="map"
          label="GPS"
          color="#2563EB"
          onPress={() => router.push("/map" as any)}
        />

        <FeatureButton
          icon="pulse"
          label="Motion"
          color="#16A34A"
          onPress={() => router.push("/accelerometer" as any)}
        />

        <FeatureButton
          icon="refresh"
          label="Gyroscope"
          color="#7C3AED"
          onPress={() => router.push("/gyroscope" as any)}
        />

        <FeatureButton
          icon="flashlight"
          label="Torch"
          color="#DC2626"
          onPress={() => router.push("/torch" as any)}
        />

        <FeatureButton
          icon="notifications"
          label="Alerts"
          color="#F97316"
          onPress={() => router.push("/notifications" as any)}
        />

        <FeatureButton
          icon="time"
          label="History"
          color="#111827"
          onPress={() => router.push("/history" as any)}
        />
      </View>

      <Text style={styles.sectionTitle}>
        STEM Activities
      </Text>

      {activities.map((activity) => (
        <TouchableOpacity
          key={activity.id}
          style={styles.activityCard}
          onPress={() =>
            router.push({
              pathname: "/activity/[id]" as any,
              params: { id: activity.id },
            })
          }
        >
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>
              🧪 {activity.title}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#999"
            />
          </View>

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

function FeatureButton({
  icon,
  label,
  color,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      style={styles.featureButton}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={26}
        color={color}
      />

      <Text style={styles.featureLabel}>
        {label}
      </Text>
    </TouchableOpacity>
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

  hero: {
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
    marginBottom: 24,
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 10,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  statCard: {
    backgroundColor: "white",
    width: "31%",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 3,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },

  statLabel: {
    color: "#666",
    marginTop: 4,
  },

  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  featureButton: {
    width: "31%",
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 3,
  },

  featureLabel: {
    marginTop: 10,
    fontWeight: "600",
  },

  activityCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 20,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 3,
  },

  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginRight: 12,
  },

  category: {
    color: "#2563EB",
    marginTop: 8,
    fontWeight: "600",
  },

  description: {
    color: "#555",
    marginTop: 10,
    lineHeight: 22,
  },

  difficulty: {
    marginTop: 12,
    fontWeight: "600",
  },
});