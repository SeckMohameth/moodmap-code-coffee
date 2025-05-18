import * as Location from "expo-location";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { firebaseApp } from "../../firebase/config"; // Adjust path if needed

const moods = [
  {
    emoji: "😃",
    name: "Happy",
    color: "#FFD700",
    reason: "Bright and uplifting",
  },
  {
    emoji: "🤩",
    name: "Excited",
    color: "#FFA500",
    reason: "Energetic, enthusiastic",
  },
  {
    emoji: "🙏",
    name: "Grateful",
    color: "#FFD700",
    reason: "Warm, reflective",
  },
  {
    emoji: "🌞",
    name: "Optimistic",
    color: "#FFFACD",
    reason: "Hopeful and light",
  },
  { emoji: "😊", name: "Content", color: "#FFDAB9", reason: "Gentle warmth" },
  { emoji: "👑", name: "Proud", color: "#8A2BE2", reason: "Regal, dignified" },
  {
    emoji: "💥",
    name: "Energetic",
    color: "#FF4500",
    reason: "Powerful, motivational",
  },
  {
    emoji: "❤️",
    name: "Loved",
    color: "#FF69B4",
    reason: "Warm, affectionate",
  },
  {
    emoji: "🎉",
    name: "Playful",
    color: "#87CEEB",
    reason: "Lighthearted, free",
  },
  {
    emoji: "💡",
    name: "Inspired",
    color: "#40E0D0",
    reason: "Imaginative, fresh",
  },
  {
    emoji: "💪",
    name: "Confident",
    color: "#4169E1",
    reason: "Strong, steady",
  },
  { emoji: "😌", name: "Relaxed", color: "#ADD8E6", reason: "Calm and cool" },
  {
    emoji: "🌱",
    name: "Hopeful",
    color: "#98FF98",
    reason: "Fresh, new beginnings",
  },
];

const db = getFirestore(firebaseApp);

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Helper to log mood to Firestore
  const logMood = async (mood: any) => {
    setLoading(true);
    try {
      // Ask for location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to log your mood."
        );
        setLoading(false);
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get current date/time
      const now = new Date();
      const dateString = now.toString();

      // Log to Firestore
      await addDoc(collection(db, "moodLogs"), {
        mood: mood.name,
        color: mood.color,
        lat: latitude,
        lng: longitude,
        date: dateString,
      });

      Alert.alert(
        "Mood Logged!",
        `Your mood "${mood.name}" was logged successfully.`
      );
    } catch (error) {
      Alert.alert("Error", "There was a problem logging your mood.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>What mood are you in? 😊</Text>
      <View style={styles.moodGrid}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.moodButton, { backgroundColor: mood.color }]}
            onPress={() => {
              setSelectedMood(mood);
              logMood(mood);
            }}
            disabled={loading}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.moodName}>{mood.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#888"
          style={{ marginTop: 20 }}
        />
      )}
      {selectedMood && !loading && (
        <Text style={[styles.result, { color: selectedMood.color }]}>
          You are feeling{" "}
          <Text style={{ fontWeight: "bold" }}>{selectedMood.name}</Text>!{"\n"}
          {selectedMood.reason}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  moodButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  emoji: {
    fontSize: 28,
  },
  moodName: {
    fontSize: 14,
    marginTop: 6,
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
});
