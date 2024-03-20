import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import EventDetailsPage from "../pages/EventDetailsPage";

interface VerticalEventListingProps {
  title: string;
  location: string;
  attendees: number;
  description: string;
  date: string;
  id: string;
}

const VerticalEventListing: React.FC<VerticalEventListingProps> = ({
  title,
  location,
  attendees,
  description,
  date,
  id,
}) => {
  return (
    <Link href={`/details/${id}`} asChild>
      <TouchableOpacity
        style={{
          width: 200,
          height: 200,
          marginRight: 10,
          backgroundColor: "ghostwhite",
          borderRadius: 15,
          padding: 5,
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 20, fontWeight: "bold" }}
          >
            {title}
          </Text>
          <Text
            numberOfLines={6}
            ellipsizeMode="tail"
            style={{ flexWrap: "wrap-reverse", marginBottom: 15 }}
          >
            {description}
          </Text>
        </View>
        <View>
          <Text>Attendees: {attendees}</Text>
          <Text>Location: {location}</Text>
          <Text>Date: {date}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default VerticalEventListing;
