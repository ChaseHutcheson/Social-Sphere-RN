import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity, Alert } from "react-native";
import { View } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { logOut, deleteAccount } from "@/api/users";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, authToken, setAuthToken, setAuthenticated, setUser } =
    useAuth();

  const handleLogout = () => {
    logOut(authToken!);
    SecureStore.deleteItemAsync("access_token");
    SecureStore.deleteItemAsync("refresh_token");
    setAuthToken(null);
    setAuthenticated(false);
    setUser(null);
    router.replace("/");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is irreversible.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAccount(authToken!);
            handleLogout();
          },
        },
      ]
    );
  };

  const handleAppInfo = () => {
    Alert.alert(
      "App Info",
      "Social Sphere RN\nVersion: 1.0.0"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
          }}
          style={styles.profilePic}
        />

        <Text style={styles.name}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.username}>@{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>{user?.date_of_birth}</Text>

        <Text style={styles.label}>Account Created:</Text>
        <Text style={styles.value}>{user?.created_at.split("T")[0]}</Text>

        <Text style={styles.label}>Account Verified:</Text>
        <Text style={styles.value}>{user?.is_verified ? "Yes" : "No"}</Text>

        {user?.is_verified && (
          <>
            <Text style={styles.label}>Verified At:</Text>
            <Text style={styles.value}>{user?.verified_at}</Text>
          </>
        )}

        {/* Log Out button */}
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>

        {/* Delete Account button */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>

        {/* App Info button */}
        <TouchableOpacity
          onPress={handleAppInfo}
          style={[styles.button, styles.infoButton]}
        >
          <Text style={styles.buttonText}>App Info</Text>
        </TouchableOpacity>
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
    padding: 16,
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
    marginBottom: 8,
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
  button: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007BFF",
    width: "80%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF4D4D",
  },
  infoButton: {
    backgroundColor: "#6C757D",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
