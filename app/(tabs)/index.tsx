import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { activities } from "../../src/data/activities";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient colors={["#0F172A", "#2563EB"]} style={styles.hero}>
        <Text style={styles.heroTitle}>STEMM Lab</Text>
        <Text style={styles.heroText}>
          Real-world science challenges using sensors, GPS, Firebase, and mobile tools.
        </Text>
      </LinearGradient>

      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/history" as any)}>
          <Ionicons name="time" size={24} color="#2563EB" />
          <Text style={styles.quickText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/map" as any)}>
          <Ionicons name="map" size={24} color="#16A34A" />
          <Text style={styles.quickText}>GPS Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/notifications" as any)}>
          <Ionicons name="notifications" size={24} color="#F97316" />
          <Text style={styles.quickText}>Alerts</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Activities</Text>

      <View style={styles.grid}>
        {activities.map((activity, index) => (
          <TouchableOpacity
            key={activity.id}
            style={styles.tile}
            onPress={() =>
              router.push({
                pathname: "/activity/[id]" as any,
                params: { id: activity.id },
              })
            }
          >
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>{getIcon(index)}</Text>
            </View>

            <Text style={styles.tileTitle}>{activity.title}</Text>
            <Text style={styles.tileCategory}>{activity.category}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activity.difficulty}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

function getIcon(index: number) {
  return ["🪂", "🔊", "🌬️", "🏗️", "🏃", "⚡", "🫁"][index] || "🧪";
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7FB" },
  content: { padding: 20, paddingBottom: 40 },

  hero: {
    padding: 26,
    borderRadius: 28,
    marginTop: 10,
    marginBottom: 22,
  },
  heroTitle: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
  },
  heroText: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 10,
    fontSize: 16,
    lineHeight: 23,
  },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  quickCard: {
    width: "31%",
    backgroundColor: "white",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickText: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    minHeight: 210,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  icon: {
    fontSize: 28,
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23,
  },
  tileCategory: {
    marginTop: 8,
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 13,
  },
  badge: {
    marginTop: "auto",
    backgroundColor: "#F1F5F9",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontWeight: "800",
    color: "#0F172A",
    fontSize: 12,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
});