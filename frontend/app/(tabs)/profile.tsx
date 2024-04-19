import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { View } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "@/api/users";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, authToken, setAuthToken, setAuthenticated, setUser } =
    useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={styles.profileContainer}>
          {/* Placeholder for user's profile picture */}
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
            }}
            style={styles.profilePic}
          />

          {/* Display user's name and username */}
          <Text style={styles.name}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.username}>@{user?.username}</Text>

          {/* Display user's email */}
          <Text style={styles.email}>{user?.email}</Text>

          {/* Display user's date of birth */}
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{user?.date_of_birth}</Text>

          {/* Display account creation date */}
          <Text style={styles.label}>Account Created:</Text>
          <Text style={styles.value}>{user?.created_at.split("T")[0]}</Text>

          {/* Display account verification status */}
          <Text style={styles.label}>Account Verified:</Text>
          <Text style={styles.value}>{user?.is_verified ? "Yes" : "No"}</Text>

          {/* Display account verification date if verified */}
          {user?.is_verified && (
            <>
              <Text style={styles.label}>Verified At:</Text>
              <Text style={styles.value}>{user?.verified_at}</Text>
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              logOut(authToken!);
              SecureStore.deleteItemAsync("access_token");
              SecureStore.deleteItemAsync("refresh_token");

              setAuthToken(null);
              setAuthenticated(false);
              setUser(null);
              router.replace("/");
            }}
          >
            <Text style={{ fontSize: 18, marginLeft: 10 }}>Log Out</Text>
          </TouchableOpacity>
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
