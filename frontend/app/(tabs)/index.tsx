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
  const { isAuthenticated, authToken, refreshToken } = useAuth();
  const [items, setItems] = useState<Event[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    setFetchLoading(true);
    const response = await getNewestEvents(authToken!, refreshToken!, page);
    if (page > 1) {
      setItems((prevItems) => [...prevItems, ...response?.data]);
      setHasMore(response?.data.length > 0);
      setFetchLoading(false);
    } else {
      setItems(response?.data);
      setHasMore(response?.data.length > 0);
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
    <SafeAreaView style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileContainer: {
    width: "100%",
    alignItems: "center",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "blue",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
});
