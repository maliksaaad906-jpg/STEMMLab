import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { activities } from "../../src/data/activities";

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();
  const activity = activities.find((item) => item.id === id);

  const [prediction, setPrediction] = useState("");
  const [result, setResult] = useState("");
  const [notes, setNotes] = useState("");

  if (!activity) {
    return (
      <View style={styles.center}>
        <Text>Activity not found.</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!prediction || !result) {
      Alert.alert("Missing information", "Please enter prediction and result.");
      return;
    }

    Alert.alert("Saved", "Activity result recorded locally for now.");

    setPrediction("");
    setResult("");
    setNotes("");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{activity.title}</Text>
      <Text style={styles.category}>{activity.category}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.text}>{activity.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prediction</Text>
        <TextInput
          placeholder="Example: I think this will take 3 seconds"
          value={prediction}
          onChangeText={setPrediction}
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Result</Text>
        <TextInput
          placeholder="Example: 2.8 seconds / 65 dB / 30 degrees"
          value={result}
          onChangeText={setResult}
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reflection Notes</Text>
        <TextInput
          placeholder="What happened? Were you correct? Any surprises?"
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, styles.notesInput]}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Activity Result</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "white",
  },
  notesInput: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 14,
    marginTop: 24,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});