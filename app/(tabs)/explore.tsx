import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

// This screen only shows a full-screen map with a marker.
export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject} // Makes the map fill the entire screen
        initialRegion={{
          latitude: 37.7749, // Center latitude (San Francisco)
          longitude: -122.4194, // Center longitude (San Francisco)
          latitudeDelta: 0.0922, // How much to zoom vertically
          longitudeDelta: 0.0421, // How much to zoom horizontally
        }}
      >
        {/* Marker shows a pin on the map */}
        <Marker
          coordinate={{ latitude: 37.7749, longitude: -122.4194 }}
          title="San Francisco"
          description="This is a marker in San Francisco"
        />
      </MapView>
    </View>
  );
}

// Styles for the full-screen map container
const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the whole screen
  },
});
