import { Audio } from "expo-av";
import { useRef, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  onResult: (result: string) => void;
};

export default function SoundMeter({ onResult }: Props) {
  const recordingRef = useRef<Audio.Recording | null>(null);

  const [recording, setRecording] = useState(false);
  const [level, setLevel] = useState(0);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission denied",
          "Microphone permission is required."
        );

        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingObject = new Audio.Recording();

      await recordingObject.prepareToRecordAsync({
        android: {
          extension: ".m4a",
          outputFormat: 2,
          audioEncoder: 3,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          meteringEnabled: true,
        },

        ios: {
          extension: ".m4a",
          audioQuality: 2,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
          meteringEnabled: true,
        },
      } as any);

      await recordingObject.startAsync();

      recordingRef.current = recordingObject;

      setRecording(true);

      const interval = setInterval(async () => {
        if (!recordingRef.current) return;

        const status = await recordingRef.current.getStatusAsync();

        if ("metering" in status && status.metering) {
          const soundLevel = Math.round(status.metering + 160);

          setLevel(soundLevel);

          onResult(`Measured sound level: ${soundLevel} dB`);
        }
      }, 500);

      (recordingRef.current as any).interval = interval;
    } catch (error: any) {
      Alert.alert("Recording Error", error.message);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    clearInterval((recordingRef.current as any).interval);

    await recordingRef.current.stopAndUnloadAsync();

    setRecording(false);

    onResult(`Final sound level: ${level} dB`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Sound Meter</Text>

      <Text style={styles.level}>
        {level} dB
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          recording && styles.stopButton,
        ]}
        onPress={recording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? "Stop Measuring" : "Start Measuring"}
        </Text>
      </TouchableOpacity>
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
    fontWeight: "900",
    marginBottom: 12,
  },

  level: {
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 18,
    color: "#DC2626",
  },

  button: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 12,
  },

  stopButton: {
    backgroundColor: "#DC2626",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "800",
  },
});