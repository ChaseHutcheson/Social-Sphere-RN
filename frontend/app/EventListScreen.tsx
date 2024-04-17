import React, { useEffect, useLayoutEffect } from "react";
import {
  Text,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Event } from "../constants/Types";
import { View } from "../components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { attendEvent } from "@/api/events";

export default function EventListScreen() {
  const colorScheme = useColorScheme();
  const { item } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user, authToken } = useAuth();

  let parsedItem: Event;

  // Check the type of the `item` parameter
  if (typeof item === "string") {
    parsedItem = JSON.parse(item);
  } else if (Array.isArray(item)) {
    parsedItem = JSON.parse(item[0]);
  } else {
    throw new Error("Unexpected type for item parameter");
  }

  useEffect(() => {
    console.log(parsedItem);
  }, [parsedItem]);

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 18, marginLeft: 10 }}>{"< Back"}</Text>
      </TouchableOpacity>
      <View
        style={[
          styles.container,
          colorScheme === "light" ? styles.light : styles.dark,
        ]}
      >
        <Text
          style={[
            styles.title,
            colorScheme === "light" ? styles.titleLight : styles.titleDark,
          ]}
        >
          {parsedItem.title}
        </Text>
        <Text
          style={[
            styles.content,
            colorScheme === "light" ? styles.contentLight : styles.contentDark,
          ]}
          ellipsizeMode="tail"
          numberOfLines={4}
        >
          {parsedItem.content}
        </Text>
        <Text style={styles.postedBy}>Posted By: {parsedItem.user_name}</Text>
        <Text style={styles.postedBy}>Post ID: {parsedItem.post_id}</Text>
        {user?.id === parsedItem.user_id ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 18 }}>Edit Event</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => attendEvent(parsedItem.post_id, authToken!)}
          >
            <Text style={{ fontSize: 18}}>Attend Event</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    marginTop: 5,
  },
  postedBy: {
    color: "grey",
    marginTop: 10,
  },
  light: {
    backgroundColor: "white",
  },
  dark: {
    backgroundColor: "black",
  },
  titleLight: {
    color: "black",
  },
  titleDark: {
    color: "white",
  },
  contentLight: {
    color: "black",
  },
  contentDark: {
    color: "white",
  },
});
