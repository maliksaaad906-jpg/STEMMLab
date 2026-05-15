import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ReactionGameProps = {
  onResult: (result: string) => void;
};

export default function ReactionGame({ onResult }: ReactionGameProps) {
  const [status, setStatus] = useState<"idle" | "waiting" | "ready" | "done">(
    "idle"
  );
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = () => {
    setReactionTime(null);
    setStatus("waiting");

    const delay = Math.floor(Math.random() * 3000) + 2000;

    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setStatus("ready");
    }, delay);
  };

  const handleTap = () => {
    if (status === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus("idle");
      Alert.alert("Too early!", "Wait until the button says TAP NOW.");
      return;
    }

    if (status === "ready") {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setStatus("done");
      onResult(`${time} ms`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reaction Board Challenge</Text>

      {status === "idle" && (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.buttonText}>Start Reaction Test</Text>
        </TouchableOpacity>
      )}

      {status === "waiting" && (
        <TouchableOpacity style={styles.waitingButton} onPress={handleTap}>
          <Text style={styles.buttonText}>Wait...</Text>
        </TouchableOpacity>
      )}

      {status === "ready" && (
        <TouchableOpacity style={styles.tapButton} onPress={handleTap}>
          <Text style={styles.buttonText}>TAP NOW!</Text>
        </TouchableOpacity>
      )}

      {status === "done" && (
        <>
          <Text style={styles.result}>Your reaction time: {reactionTime} ms</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginTop: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },
  startButton: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
  },
  waitingButton: {
    backgroundColor: "#6B7280",
    padding: 16,
    borderRadius: 12,
  },
  tapButton: {
    backgroundColor: "#16A34A",
    padding: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  result: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
});