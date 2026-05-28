import { StyleSheet, Text, View } from "react-native";

export default function BannerAdCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Sponsored STEM Resource
      </Text>

      <Text style={styles.placeholder}>
        STEMM Lab challenge tip: record your prediction before testing.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    alignItems: "center",
  },

  label: {
    fontWeight: "800",
    marginBottom: 8,
    color: "#555",
  },

  placeholder: {
    color: "#334155",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },
});
