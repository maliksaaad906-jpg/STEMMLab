import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../src/firebase/firebaseConfig";

type ActivityResult = {
  id: string;
  activityTitle: string;
  category?: string;
  result?: string;
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

      setResults(data.reverse());
    } catch (error) {
      console.log("History fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const formatDate = (value: any) => {
    if (!value?.toDate) return "Unknown date";
    return value.toDate().toLocaleString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading activity history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Activity History</Text>
        <Text style={styles.subtitle}>
          Saved STEMM Lab experiment results from Firestore.
        </Text>

        {results.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="folder-open" size={36} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No results saved yet</Text>
            <Text style={styles.emptyText}>
              Complete an activity and press save to see it here.
            </Text>
          </View>
        ) : (
          results.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="flask" size={22} color="#2563EB" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.activityTitle}</Text>
                  <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                </View>
              </View>

              {item.category ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.category}</Text>
                </View>
              ) : null}

              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Calculated Result</Text>
                <Text style={styles.resultText}>
                  {item.result || "No result data available"}
                </Text>
              </View>
            </View>
          ))
        )}
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FB",
  },
  loadingText: {
    marginTop: 12,
    color: "#555",
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
  emptyCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 22,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 12,
  },
  emptyText: {
    color: "#555",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 21,
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
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  dateText: {
    color: "#64748B",
    marginTop: 4,
    fontSize: 12,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF4FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 14,
  },
  badgeText: {
    color: "#2563EB",
    fontWeight: "800",
    fontSize: 12,
  },
  resultBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
  },
  resultLabel: {
    fontWeight: "900",
    marginBottom: 6,
  },
  resultText: {
    color: "#334155",
    lineHeight: 21,
  },
});