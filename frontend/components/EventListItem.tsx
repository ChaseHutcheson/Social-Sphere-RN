import React from "react";
import {
  Text,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Event } from "../constants/Types";
import { View } from "./Themed";
import { useRouter } from "expo-router";

type EventListItemProps = {
  item: Event;
};

export default function EventListItem({ item }: EventListItemProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const formattedDeadline = new Date(item.deadline).toLocaleString();
  const isExpired = new Date(item.deadline) < new Date();
  const renderDeadline = isExpired ? "Expired" : formattedDeadline;

  return (
    <TouchableOpacity
      onPress={() => {
        const serializedItem = JSON.stringify(item);
        router.push({
          pathname: "/(screens)/eventListingScreen",
          params: { item: serializedItem },
        });
      }}
      style={styles.container}
    >
      <View
        style={[
          styles.innerContainer,
          colorScheme === "light" ? styles.light : styles.dark,
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content} ellipsizeMode="tail" numberOfLines={4}>
          {item.content}
        </Text>
        <Text style={styles.content}>Event Date: {renderDeadline}</Text>
        <Text style={styles.postedBy}>Posted By: {item.user_name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: "90%", // limit the width to 90% of the parent container
  },
  innerContainer: {
    padding: 10,
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
  deadline: {
    fontSize: 14,
    color: "red",
    marginBottom: 10,
  },
  postedBy: {
    fontSize: 14,
    color: "grey",
  },
  light: {
    backgroundColor: "#f0f0f0",
    color: "black",
  },
  dark: {
    backgroundColor: "black",
    color: "white",
  },
});
