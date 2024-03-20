import { View, Text } from "react-native";
import React from "react";
import eventData from "@/assets/data/events";
import { useLocalSearchParams } from "expo-router";

const DetailsPage = () => {
  const { id } = useLocalSearchParams();
  const listing = (eventData as any[]).find((item) => item.id === id);
  return (
    <View>
      <Text>{listing.title}</Text>
      <Text>{listing.description}</Text>
      <Text>{listing.attendees}</Text>
      <Text>{listing.location}</Text>
      <Text>{listing.date}</Text>
      <Text>{listing.id}</Text>
    </View>
  );
};

export default DetailsPage;
