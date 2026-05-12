import { useState } from "react";

import {
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

import {
    auth,
    db,
} from "../src/firebase/firebaseConfig";

import { router } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [grade, setGrade] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        name,
        team,
        grade,
        email,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created!");

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Register Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
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

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});