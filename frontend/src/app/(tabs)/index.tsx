// HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/context/AuthContext";
import { getNewestEvents } from "@/src/api/events";
import EventListItem from "@/src/components/EventListItem";
import { Event } from "@/src/constants/Types";

export default function HomeScreen() {
  const { isAuthenticated, authToken } = useAuth();
  const [items, setItems] = useState<Event[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchItems = async (page: number, token: string) => {
    if (isAuthenticated) {
      setFetchLoading(true);
      try {
        const eventsResponse = await getNewestEvents(page, token);
        setItems((prevItems: Event[]) => [
          ...prevItems,
          ...eventsResponse?.data,
        ]);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setFetchLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchItems(page, authToken!);
  }, [page, authToken, isAuthenticated]);

  const loadMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
      {fetchLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={items}
          renderItem={({ item }) => <EventListItem item={item} />}
          keyExtractor={(item) => item.post_id.toString()}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          onEndReached={loadMoreData}
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
