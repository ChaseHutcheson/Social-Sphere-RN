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
  const [page, setPage] = useState(2);

  const fetchItems = async () => {
    await getNewestEvents(1, authToken!).then((response) => (setItems(response)))
    setFetchLoading(false)
  }

  const fetchMoreEvents = async () => {
    setFetchLoading(true);
    await setPage(page + 1);
    await getNewestEvents(page, authToken!).then((response) => setItems([...items, ...response]));
    setFetchLoading(false);
  }

  useEffect(() => {
    fetchItems()
  }, [])

return (
  <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
    {fetchLoading ? (
      <ActivityIndicator />
    ) : items.length === 0 ? (
      <Text>No events found</Text>
    ) : (
      <FlatList
        data={items}
        renderItem={({ item }) => <EventListItem item={item} />}
        keyExtractor={(item) => item.post_id.toString()}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        onEndReached={async () => {
          await setPage(page + 1)
          await fetchMoreEvents()
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
