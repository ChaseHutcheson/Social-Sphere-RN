import React from "react";
import {
  Text,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Event } from "@/constants/Types";
import { View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { attendEvent, deleteEvent } from "@/api/events";

export default function EventListScreen() {
  const colorScheme = useColorScheme();
  const { item } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user, authToken, refreshToken } = useAuth();

  let parsedItem: Event;

  // Check the type of the `item` parameter
  if (typeof item === "string") {
    parsedItem = JSON.parse(item);
  } else if (Array.isArray(item)) {
    parsedItem = JSON.parse(item[0]);
  } else {
    throw new Error("Unexpected type for item parameter");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>{"< Back"}</Text>
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
        <Text style={styles.postedBy}>Post ID: {parsedItem.post_id}</Text>
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
