import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { activities } from "../../src/data/activities";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();

  const activity = activities.find((item) => item.id === id);

  if (!activity) {
    return (
      <View style={styles.center}>
        <Text>Activity not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{activity.title}</Text>
      <Text style={styles.category}>{activity.category}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.text}>{activity.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Task</Text>
        <Text style={styles.text}>
          Complete the activity, record your prediction, collect your result,
          and save your reflection.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Text style={styles.text}>Activity screen created successfully.</Text>
      </View>
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
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
  },
  category: {
    color: "#2563EB",
    fontWeight: "600",
    marginTop: 8,
  },
  section: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
});