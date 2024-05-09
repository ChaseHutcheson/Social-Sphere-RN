import React, { useEffect, useState } from "react";
import {
  Text,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Event } from "@/constants/Types";
import { View } from "@/components/Themed";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { attendEvent, deleteEvent } from "@/api/events";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";

export default function EventListScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { item } = useLocalSearchParams();
  const { user, authToken, refreshToken } = useAuth();
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  let parsedItem: Event;

  if (typeof item === "string") {
    parsedItem = JSON.parse(item);
  } else if (Array.isArray(item)) {
    parsedItem = JSON.parse(item[0]);
  } else {
    throw new Error("Unexpected type for item parameter");
  }

  // Format deadline date
  const formattedDeadline = new Date(parsedItem.deadline).toLocaleString();

  // Check if deadline is in the past
  const isExpired = new Date(parsedItem.deadline) < new Date();

  // Render either formatted date or "Expired"
  const renderDeadline = isExpired ? "Expired" : formattedDeadline;

  useEffect(() => {
    fetchCoordinates(parsedItem.address)
      .then((coords) => {
        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      })
      .catch((error) => console.error(error));
  }, [parsedItem]);

  const fetchCoordinates = async (
    address: string
  ): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      const apiKey = "AIzaSyDd0YxufG2QqTaN5JG00q_oT2lmbg-czWA";

      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`;

      axios
        .get(apiUrl)
        .then((response) => {
          const data = response.data;
          if (data.status === "OK") {
            const location = data.results[0].geometry.location;
            resolve({
              latitude: location.lat,
              longitude: location.lng,
            });
          } else {
            reject(data.error_message || data.status);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome5 name="chevron-left" size={25} />
      </TouchableOpacity>
      <View
        style={[
          styles.container,
          colorScheme === "light" ? styles.light : styles.dark,
        ]}
      >
        <Text
          style={[
            styles.title,
            colorScheme === "light" ? styles.titleLight : styles.titleDark,
          ]}
        >
          {parsedItem.title}
        </Text>
        <Text
          style={[
            styles.content,
            colorScheme === "light" ? styles.contentLight : styles.contentDark,
          ]}
          ellipsizeMode="tail"
          numberOfLines={4}
        >
          {parsedItem.content}
        </Text>
        <Text style={styles.postedBy}>Posted By: {parsedItem.user_name}</Text>
        <Text style={styles.content}>Event Date: {renderDeadline}</Text>
        <Text style={styles.address}>Address: {parsedItem.address}</Text>
        <MapView style={styles.map} region={region}>
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />
        </MapView>
      </View>
      {user?.id === parsedItem.user_id ? (
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "red" }}
          onPress={async () => {
            await deleteEvent(authToken!, refreshToken!, parsedItem.post_id);
            navigation.goBack()!;
          }}
        >
          <Text style={styles.buttonText}>Delete Event</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            attendEvent(authToken!, refreshToken!, parsedItem.post_id)
          }
        >
          <Text style={styles.buttonText}>Attend Event</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    alignItems: "center",
    width: 50,
    padding: 10,
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 0.5,
    backgroundColor: "white",
    marginBottom: 15,
  },
  backText: {
    fontSize: 18,
    color: "#007AFF",
  },
  container: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  postedBy: {
    fontSize: 14,
    color: "grey",
    marginBottom: 5,
  },
  countdown: {
    fontSize: 14,
    color: "red",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    marginBottom: 5,
  },
  map: {
    height: 200,
    marginVertical: 10,
  },
  light: {
    backgroundColor: "white",
  },
  dark: {
    backgroundColor: "#1C1C1E",
  },
  titleLight: {
    color: "black",
  },
  titleDark: {
    color: "white",
  },
  contentLight: {
    color: "black",
  },
  contentDark: {
    color: "white",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
