import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BreathingPaceTrainer from "../../src/components/BreathingPaceTrainer";
import EarthquakeStructureLab from "../../src/components/EarthquakeStructureLab";
import HandFanChallenge from "../../src/components/HandFanChallenge";
import ParachuteChallenge from "../../src/components/ParachuteChallenge";
import ReactionBoardLab from "../../src/components/ReactionBoardLab";
import SoundPollutionHunter from "../../src/components/SoundPollutionHunter";
import StretchAttemptTracker from "../../src/components/StretchAttemptTracker";
import { activities } from "../../src/data/activities";
import { auth, db } from "../../src/firebase/firebaseConfig";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();
  const activity = activities.find((item) => item.id === id);

  const [result, setResult] = useState("");
  const [saving, setSaving] = useState(false);

  if (!activity) {
    return (
      <View style={styles.center}>
        <Text>Activity not found.</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!result.trim()) {
      Alert.alert(
        "Missing result",
        "Complete the activity tool to generate a result before saving."
      );
      return;
    }

    if (!auth.currentUser) {
      Alert.alert("Not logged in", "Please log in before saving activity data.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "activities"), {
        activityId: activity.id,
        activityTitle: activity.title,
        category: activity.category,
        result: result.trim(),
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });

      Alert.alert("Saved", "Activity result saved to Firestore.");
      setResult("");
    } catch (error: any) {
      Alert.alert("Save Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>      
      <LinearGradient colors={["#2563EB", "#1E40AF"]} style={styles.hero}>
        <Text style={styles.heroTitle}>{activity.title}</Text>
        <Text style={styles.heroCategory}>{activity.category}</Text>
        <Text style={styles.heroDifficulty}>Difficulty: {activity.difficulty}</Text>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle" size={22} color="#2563EB" />
          <Text style={styles.sectionTitle}>Overview</Text>
        </View>
        <Text style={styles.text}>{activity.description}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="construct" size={22} color="#16A34A" />
          <Text style={styles.sectionTitle}>Equipment</Text>
        </View>

        {activity.equipment.map((item) => (
          <Text key={item} style={styles.listItem}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list" size={22} color="#7C3AED" />
          <Text style={styles.sectionTitle}>Instructions</Text>
        </View>

        {activity.instructions.map((step, index) => (
          <Text key={step} style={styles.listItem}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>

      {activity.id === "reaction-board" && (
         <ReactionBoardLab onResult={setResult} />
       )}

      {activity.id === "stretch-speed" && (
        <StretchAttemptTracker onResult={setResult} />
      )}

      {activity.id === "earthquake-structure" && (
        <EarthquakeStructureLab onResult={setResult} />
      )}

      {activity.id === "sound-pollution" && (
        <SoundPollutionHunter onResult={setResult} />
      )}

      {activity.id === "parachute-drop" && (
        <ParachuteChallenge onResult={setResult} />
      )}

      {activity.id === "hand-fan" && (
        <HandFanChallenge onResult={setResult} />
      )}
      {activity.id === "breathing-trainer" && (
        <BreathingPaceTrainer onResult={setResult} />
      ) } 

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="analytics" size={22} color="#2563EB" />
          <Text style={styles.sectionTitle}>Calculated Result</Text>
        </View>

        {result ? (
          <View style={styles.resultBox}>
            {result.split(" | ").map((line, index) => (
  <Text key={`${line}-${index}`} style={styles.resultLine}>
    • {line}
  </Text>
))}
          </View>
        ) : (
          <Text style={styles.emptyResultText}>
            Complete the activity tool above to generate results.
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, saving && styles.disabledButton]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Saving..." : "Save Activity Result"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  heroCategory: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 8,
    fontSize: 16,
  },
  heroDifficulty: {
    color: "white",
    fontWeight: "bold",
    marginTop: 12,
  },
  section: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 18,
    marginTop: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  listItem: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 16,
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: "#EEF4FF",
    borderRadius: 14,
    padding: 14,
  },
  resultText: {
    color: "#1E3A8A",
    lineHeight: 22,
    fontWeight: "600",
  },
  emptyResultText: {
    color: "#777",
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 2,
    marginBottom: 12,
  },
  
  backButtonText: {
    fontWeight: "900",
    color: "#111827",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  resultLine: {
    color: "#1E3A8A",
    lineHeight: 24,
    fontWeight: "600",
    marginBottom: 6,
  },
});