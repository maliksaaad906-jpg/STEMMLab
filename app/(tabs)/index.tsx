import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { activities } from "../../src/data/activities";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>STEMM Lab</Text>
      <Text style={styles.subtitle}>Choose an activity to begin</Text>

      {activities.map((activity) => (
        <TouchableOpacity
          key={activity.id}
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/activity/[id]",
              params: { id: activity.id },
            })
          }
        >
          <Text style={styles.cardTitle}>{activity.title}</Text>
          <Text style={styles.category}>{activity.category}</Text>
          <Text style={styles.description}>{activity.description}</Text>
          <Text style={styles.difficulty}>Difficulty: {activity.difficulty}</Text>
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
