import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import React from "react";
import VerticalEventListing from "@/components/VerticalEventListing";
import eventData from "@/assets/data/events";

const HomePage = () => {
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
      }}
    >
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ backgroundColor: "red", paddingBottom: 20 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "500",
              marginLeft: 10,
            }}
          >
            Events Near You
          </Text>
          <FlatList
            style={{
              paddingVertical: 10,
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={eventData}
            renderItem={({ item }) => (
              <VerticalEventListing
                title={item.title}
                description={item.description}
                attendees={item.attendees}
                location={item.location}
                date={item.date}
                id={item.id}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: "blue" }}>
          <Text style={{ fontSize: 25, fontWeight: "500" }}>
            Recently Added
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
