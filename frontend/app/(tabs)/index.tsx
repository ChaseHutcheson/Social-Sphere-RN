// HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { getNewestEvents } from "@/api/events";
import EventListItem from "@/components/EventListItem";
import { Event } from "@/constants/Types";

export default function HomeScreen() {
  const { isAuthenticated, authToken } = useAuth();
  const [items, setItems] = useState<Event[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchItems = async () => {
    getNewestEvents(page, authToken!).then((response) => (setItems(response)))
    console.log("Fetched Items")
  }

  const fetchMoreItems = async () => {
    getNewestEvents(page, authToken!).then((response) => {
      setItems([...items, response?.data]);
      console.log(page);
    });
    console.log("Fetched Items");
  };

  useEffect(() => {
    fetchItems()
    setTimeout(() => {
      console.log(items);
    }, 1000)
  }, [page])

return (
  <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
    {fetchLoading ? (
      <ActivityIndicator />
    ) : items.length === 0 ? ( // Check if the items array is empty
      <Text>No events found</Text> // Show a placeholder message
    ) : (
      <FlatList
        data={items}
        renderItem={({ item }) => <EventListItem item={item} />}
        keyExtractor={(item) => item.post_id.toString()}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        onEndReached={() => {
          setPage(page + 1);
          fetchMoreItems();
        }}
        onEndReachedThreshold={0.1}
      />
    )}
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
