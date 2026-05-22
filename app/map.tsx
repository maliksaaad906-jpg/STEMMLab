import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen() {
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Location permission was denied.");
          Alert.alert("Permission denied", "Location permission is required.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setCoords(location.coords);
      } catch (err: any) {
        setError(err.message);
      }
    };

    getLocation();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>GPS Error</Text>
        <Text style={styles.note}>{error}</Text>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Loading GPS Map...</Text>
        <Text style={styles.note}>Please allow location permission.</Text>
      </View>
    );
  }

  const region = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region} showsUserLocation>
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
          title="STEMM Lab Location"
          description="Current GPS location captured"
        />
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Current GPS Location</Text>
        <Text style={styles.info}>Lat: {coords.latitude.toFixed(6)}</Text>
        <Text style={styles.info}>Lng: {coords.longitude.toFixed(6)}</Text>
        <Text style={styles.info}>
          Accuracy: {coords.accuracy?.toFixed(1) ?? "Unknown"} m
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 10,
  },
  note: {
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  infoCard: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  info: {
    color: "#444",
    marginTop: 4,
  },
});