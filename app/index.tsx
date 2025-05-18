import * as Location from 'expo-location';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebase/config';

const moods = [
  { emoji: "😃", name: "Happy", color: "#FFD700", reason: "Bright and uplifting" },
  { emoji: "🤩", name: "Excited", color: "#FFA500", reason: "Energetic, enthusiastic" },
  { emoji: "🙏", name: "Grateful", color: "#FFD700", reason: "Warm, reflective" },
  { emoji: "🌞", name: "Optimistic", color: "#FFFACD", reason: "Hopeful and light" },
  { emoji: "😊", name: "Content", color: "#FFDAB9", reason: "Gentle warmth" },
  { emoji: "👑", name: "Proud", color: "#8A2BE2", reason: "Regal, dignified" },
  { emoji: "💥", name: "Energetic", color: "#FF4500", reason: "Powerful, motivational" },
  { emoji: "❤️", name: "Loved", color: "#FF69B4", reason: "Warm, affectionate" },
  { emoji: "🎉", name: "Playful", color: "#87CEEB", reason: "Lighthearted, free" },
  { emoji: "💡", name: "Inspired", color: "#40E0D0", reason: "Imaginative, fresh" },
  { emoji: "💪", name: "Confident", color: "#4169E1", reason: "Strong, steady" },
  { emoji: "😌", name: "Relaxed", color: "#ADD8E6", reason: "Calm and cool" },
  { emoji: "🌱", name: "Hopeful", color: "#98FF98", reason: "Fresh, new beginnings" },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<{ name: string; color: string; reason: string } | null>(null);

  const logMood = async () => {
    if (!selectedMood) return;

    try {
      // Get permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to log your mood.');
        return;
      }

      // Get location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get timestamp
      const timestamp = new Date().toISOString();

      // Store in Firestore
      await addDoc(collection(db, 'moodLogs'), {
        mood: selectedMood.name,
        color: selectedMood.color,
        reason: selectedMood.reason,
        latitude,
        longitude,
        timestamp,
      });

      Alert.alert('Success', 'Mood logged successfully!');
    } catch (error) {
      console.error("Logging error:", error);
      Alert.alert('Error', 'Failed to log mood.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>What mood are you in? 😊</Text>
      <View style={styles.moodGrid}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.moodButton, { backgroundColor: mood.color }]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.moodName}>{mood.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedMood && (
        <>
          <Text style={[styles.result, { color: selectedMood.color }]}>
            You are feeling <Text style={{ fontWeight: 'bold' }}>{selectedMood.name}</Text>!{"\n"}
            {selectedMood.reason}
          </Text>
          <TouchableOpacity style={styles.logButton} onPress={logMood}>
            <Text style={styles.logButtonText}>Log</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '600',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  moodButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
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
    textAlign: 'center',
  },
  logButton: {
    marginTop: 20,
    backgroundColor: '#4682B4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});