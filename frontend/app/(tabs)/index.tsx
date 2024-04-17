import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { getNewestEvents } from "@/api/events";
import EventListItem from "@/components/EventListItem";
import { Event } from "@/constants/Types";
import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";

export default function HomeScreen() {
  const { isAuthenticated, authToken } = useAuth();
  const [items, setItems] = useState<Event[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    setFetchLoading(true);
    const response = await getNewestEvents(page, authToken!);
    if (page > 1) {
      setItems((prevItems) => [...prevItems, ...response]);
      setHasMore(response.length > 0);
      setFetchLoading(false);
    } else {
      setItems(response);
      setHasMore(response.length > 0);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  const handleEndReached = async () => {
    if (!fetchLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "700" }}>
          Newest Events
        </Text>
        <View
          style={{
            alignSelf: "center",
            borderBottomColor: "black",
            marginBottom: 15,
            width: 350,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View style={{ flex: 1 }}>
          {fetchLoading && items.length === 0 ? (
            <ActivityIndicator />
          ) : items.length === 0 ? (
            <Text>No events found</Text>
          ) : (
            <FlatList
              data={items}
              renderItem={({ item }) => <EventListItem item={item} />}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              onEndReached={handleEndReached}
              onEndReachedThreshold={1}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
