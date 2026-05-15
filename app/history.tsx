import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { auth, db } from "../src/firebase/firebaseConfig";

type ActivityResult = {
  id: string;
  activityTitle: string;
  prediction: string;
  result: string;
  notes: string;
  createdAt?: any;
};

export default function HistoryScreen() {
  const [results, setResults] = useState<ActivityResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        setResults([]);
        return;
      }

      const q = query(
        collection(db, "activities"),
        where("userId", "==", userId)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ActivityResult, "id">),
      }));

      setResults(data);
    } catch (error) {
      console.log("History fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Activity History</Text>
      <Text style={styles.subtitle}>Your saved STEMM Lab results</Text>

      {results.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No activity results saved yet.</Text>
        </View>
      ) : (
        results.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.activityTitle}</Text>

            <Text style={styles.label}>Prediction</Text>
            <Text style={styles.value}>{item.prediction}</Text>

            <Text style={styles.label}>Result</Text>
            <Text style={styles.value}>{item.result}</Text>

            {item.notes ? (
              <>
                <Text style={styles.label}>Reflection</Text>
                <Text style={styles.value}>{item.notes}</Text>
              </>
            ) : null}
          </View>
        ))
      )}
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
  loadingText: {
    marginTop: 12,
    color: "#555",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    color: "#555",
    marginTop: 6,
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
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginTop: 8,
    color: "#2563EB",
  },
  value: {
    color: "#444",
    marginTop: 4,
    lineHeight: 20,
  },
  emptyCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
  },
  emptyText: {
    color: "#555",
    textAlign: "center",
  },
});