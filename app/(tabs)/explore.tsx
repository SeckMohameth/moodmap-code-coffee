import { collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { firebaseApp } from "../../firebase/config"; // Adjust path if needed

// Helper: Convert Firestore Timestamp or string to a readable date string
function formatDate(date: any) {
  // If it's a Firestore Timestamp object, convert to JS Date
  if (date && typeof date === "object" && "seconds" in date) {
    return new Date(date.seconds * 1000).toLocaleString();
  }
  // If it's already a string, just return it
  if (typeof date === "string") return date;
  // Fallback
  return "";
}

// Helper to slightly offset markers that share the same location
function offsetCoords(lat: number, lng: number, index: number) {
  // Offset by up to ~10 meters (0.0001 deg) per duplicate
  const offset = 0.0001 * index;
  // Alternate direction for each duplicate
  return {
    latitude: lat + offset * Math.cos((index * 2 * Math.PI) / 5),
    longitude: lng + offset * Math.sin((index * 2 * Math.PI) / 5),
  };
}

// This component fetches mood logs from Firestore and displays them as colored pins on the map
export default function ExploreScreen() {
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch mood logs from Firestore when the component mounts
    const fetchMoodLogs = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const querySnapshot = await getDocs(collection(db, "moodLogs"));
        const logs: any[] = [];
        querySnapshot.forEach((doc) => {
          logs.push({ id: doc.id, ...doc.data() });
        });
        setMoodLogs(logs);
      } catch (error) {
        console.error("Error fetching mood logs:", error);
      }
      setLoading(false);
    };

    fetchMoodLogs();
  }, []);

  // Group logs by lat/lng to find duplicates and offset them
  const grouped = moodLogs.reduce((acc, log) => {
    const key = `${log.lat},${log.lng}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {} as Record<string, any[]>);

  // Default region (centered on the US, but you can change this)
  const initialRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 30,
    longitudeDelta: 30,
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#888" style={{ flex: 1 }} />
      ) : (
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
        >
          {Object.values(grouped).flatMap((logsAtSpot) =>
            logsAtSpot.map((log, i) => (
              <Marker
                key={log.id}
                coordinate={offsetCoords(log.lat, log.lng, i)}
                pinColor={log.color}
              >
                <Callout>
                  <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 24 }}>{log.emoji || "😊"}</Text>
                    <Text style={{ fontWeight: "bold", color: log.color }}>
                      {log.mood}
                    </Text>
                    {/* Convert Firestore Timestamp to string for display */}
                    <Text style={{ fontSize: 12 }}>{formatDate(log.date)}</Text>
                  </View>
                </Callout>
              </Marker>
            ))
          )}
        </MapView>
      )}
    </View>
  );
}

// Styles for the full-screen map container
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the whole screen
  },
});
