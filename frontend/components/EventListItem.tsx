import React from "react";
import {
  Text,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Event } from "../constants/Types"; // Import the Event type
import { View } from "./Themed";
import { useRouter } from "expo-router"; // Import useRouter from expo-router

type EventListItemProps = {
  item: Event;
};

export default function EventListItem({ item }: EventListItemProps) {
  const colorScheme = useColorScheme();
  const router = useRouter(); // Initialize the router

  return (
    <TouchableOpacity
      onPress={() => {
        // Serialize the item object to a JSON string
        const serializedItem = JSON.stringify(item);

        // Pass the serialized item as a parameter when navigating to EventListScreen
        router.push({
          pathname: "/eventListingScreen",
          params: { item: serializedItem },
        });
      }}
    >
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
          {item.title}
        </Text>
        <Text
          style={[
            styles.content,
            colorScheme === "light" ? styles.contentLight : styles.contentDark,
          ]}
          ellipsizeMode="tail"
          numberOfLines={4}
        >
          {item.content}
        </Text>
        <Text style={styles.postedBy}>Posted By: {item.user_name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 350,
    borderRadius: 10,
    padding: 10,
    marginVertical: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    marginTop: 5,
  },
  postedBy: {
    color: "grey",
    marginTop: 10,
  },
  light: {
    backgroundColor: "#f0f0f0",
  },
  dark: {
    backgroundColor: "black",
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
});
