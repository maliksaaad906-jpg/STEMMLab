import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TorchScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Torch Access</Text>
        <Text style={styles.info}>Camera permission is needed to use the torch.</Text>

        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.hiddenCamera} enableTorch={torchOn} />

      <Text style={styles.title}>Torch Control</Text>
      <Text style={styles.info}>
        Use the phone torch as part of device capability testing.
      </Text>

      <TouchableOpacity
        style={[styles.button, torchOn && styles.buttonOn]}
        onPress={() => setTorchOn(!torchOn)}
      >
        <Text style={styles.buttonText}>
          {torchOn ? "Turn Torch Off" : "Turn Torch On"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  hiddenCamera: {
    width: 1,
    height: 1,
    opacity: 0,
    position: "absolute",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 12,
  },
  info: {
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 14,
    width: "100%",
  },
  buttonOn: {
    backgroundColor: "#16A34A",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
