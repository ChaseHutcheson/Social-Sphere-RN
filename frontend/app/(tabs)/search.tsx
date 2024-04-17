import { getFilteredEvents } from "@/api/events";
import EventListItem from "@/components/EventListItem";
import { Event } from "@/constants/Types";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SearchResult = {
  id: number;
  name: string;
};

export default function SearchScreen() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Event[]>([]);
  const { authToken } = useAuth();

  const data: SearchResult[] = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    // Add more items as needed
  ];

  const handleSearch = async (query: string) => {
    const filteredResults = await getFilteredEvents(query, authToken!);
    setResults(filteredResults);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          handleSearch(text);
        }}
      />
      <FlatList
        data={results}
        contentContainerStyle={{alignItems: "center"}}
        keyExtractor={(item: Event) => item.post_id.toString()}
        renderItem={({ item }) => <EventListItem item={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  resultText: {
    fontSize: 16,
  },
});
