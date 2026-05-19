import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  setDoc,
} from "firebase/firestore";

import { router } from "expo-router";

import {
  auth,
  db,
} from "../src/firebase/firebaseConfig";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [grade, setGrade] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const showMessage = (title: string, message: string) => {
    if (typeof window !== "undefined") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const validateRegister = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !name.trim() ||
      !team.trim() ||
      !grade.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      showMessage(
        "Validation Error",
        "Please fill in all required fields."
      );
      return false;
    }

    if (!emailRegex.test(email)) {
      showMessage(
        "Validation Error",
        "Please enter a valid email address."
      );
      return false;
    }

    if (password.length < 6) {
      showMessage(
        "Validation Error",
        "Password must be at least 6 characters."
      );
      return false;
    }

    return true;
  };

  const getFirebaseErrorMessage = (code?: string) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered.";

      case "auth/invalid-email":
        return "The email address is invalid.";

      case "auth/weak-password":
        return "Password is too weak.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      default:
        return "Registration failed. Please try again.";
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;

    setLoading(true);

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        name: name.trim(),
        team: team.trim(),
        grade: grade.trim(),
        email: email.trim(),
        createdAt: new Date(),
      });

      showMessage(
        "Success",
        "Account created successfully!"
      );

      router.replace("/(tabs)");
    } catch (error: any) {
      showMessage(
        "Register Error",
        getFirebaseErrorMessage(error.code)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create Account
      </Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Team Name"
        style={styles.input}
        value={team}
        onChangeText={setTeam}
      />

      <TextInput
        placeholder="Grade"
        style={styles.input}
        value={grade}
        onChangeText={setGrade}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            Register
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },

  button: {
    backgroundColor: "black",
    padding: 16,
    borderRadius: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});