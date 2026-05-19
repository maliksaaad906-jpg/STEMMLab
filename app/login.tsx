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

import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../src/firebase/firebaseConfig";

export default function LoginScreen() {
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

  const validateLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !password.trim()) {
      showMessage(
        "Validation Error",
        "Please enter both email and password."
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
      case "auth/invalid-email":
        return "The email address is invalid.";

      case "auth/user-not-found":
      case "auth/invalid-credential":
        return "Invalid email or password.";

      case "auth/wrong-password":
        return "Incorrect password.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      default:
        return "Login failed. Please try again.";
    }
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      showMessage(
        "Success",
        "Logged in successfully!"
      );

      router.replace("/(tabs)");
    } catch (error: any) {
      showMessage(
        "Login Error",
        getFirebaseErrorMessage(error.code)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STEMM Lab</Text>

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
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
      >
        <Text style={styles.link}>
          Don&apos;t have an account? Register
        </Text>
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
    marginBottom: 20,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
  },
});