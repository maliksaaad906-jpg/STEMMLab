import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const reminders = [
  {
    title: "Parachute Prototype Reminder",
    body: "Test your next parachute design and upload video evidence.",
    icon: "airplane",
    color: "#2563EB",
  },
  {
    title: "Breathing Test Reminder",
    body: "Record breathing at rest, after jogging, and after star jumps.",
    icon: "heart",
    color: "#DC2626",
  },
  {
    title: "Reaction Board Reminder",
    body: "Complete dominant hand, non-dominant hand, and tracing challenges.",
    icon: "flash",
    color: "#F97316",
  },
  {
    title: "Sound Pollution Reminder",
    body: "Measure three classroom actions and compare loudness levels.",
    icon: "volume-high",
    color: "#7C3AED",
  },
];

export default function NotificationsScreen() {
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied", "Notifications will not work.");
    }
  };

  const scheduleReminder = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: {
        seconds: 5,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });

    Alert.alert("Reminder Scheduled", "You will receive this reminder shortly.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>STEM Reminders</Text>
        <Text style={styles.subtitle}>
          Schedule reminders for unfinished STEMM Lab challenges.
        </Text>

        {reminders.map((item) => (
          <View key={item.title} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon as any} size={26} color={item.color} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.body}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: item.color }]}
              onPress={() => scheduleReminder(item.title, item.body)}
            >
              <Text style={styles.buttonText}>Schedule Reminder</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
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
    fontWeight: "900",
    marginTop: 10,
  },
  subtitle: {
    color: "#555",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
  },
  cardBody: {
    color: "#555",
    marginTop: 4,
    lineHeight: 20,
  },
  button: {
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
  },
});