// EventListItem.tsx
import React from "react";
import { View, Text } from "react-native";
import { Event } from "../constants/Types"; // Make sure Event type is imported from a shared location

// Define the prop types for EventListItem
type EventListItemProps = {
  item: Event;
};

const EventListItem = ({ item }: EventListItemProps) => {
  return (
    <View
      style={{
        backgroundColor: "grey",
        height: 100,
        width: 300,
        alignItems: "flex-start",
        marginVertical: 1,
      }}
    >
      <Text style={{ color: "white" }}>{item.title}</Text>
      <Text style={{ color: "white" }}>Hello</Text>
      <Text style={{ color: "white" }}>{item.post_id}</Text>
    </View>
  );
};

export default EventListItem;
