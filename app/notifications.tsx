import { useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationsScreen() {
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } =
      await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Notifications will not work."
      );
    }
  };

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "STEMM Lab Reminder",
        body: "Complete your STEM activity today!",
      },

      trigger: {
        seconds: 3,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });

    Alert.alert(
      "Notification Scheduled",
      "You will receive a reminder in 3 seconds."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Notifications
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={sendNotification}
      >
        <Text style={styles.buttonText}>
          Send Reminder Notification
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FB",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#F97316",
    padding: 18,
    borderRadius: 14,
    width: "100%",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});