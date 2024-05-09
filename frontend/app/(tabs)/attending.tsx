import React from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import EventListItem from "@/components/EventListItem";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAttendingEvents } from "@/api/events";
import { Event } from "@/constants/Types";

export default function AttendingScreen() {
  const { isAuthenticated, authToken, refreshToken } = useAuth();
  const [items, setItems] = useState<Event[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    setFetchLoading(true);
    const response = await getAttendingEvents(authToken!, refreshToken!);
    setItems(response?.data);
    setHasMore(response?.data.length > 0);
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "700" }}>
          Attending Events
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
            <Text style={styles.message}>Your not attending any events.</Text>
          ) : (
            <FlatList
              data={items}
              renderItem={({ item }) => <EventListItem item={item} />}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  message: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
});
