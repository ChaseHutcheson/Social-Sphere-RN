import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Link, Redirect, router } from "expo-router";
import Button from "@/src/components/CustomButton";
import { useFonts } from "expo-font";

export default function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/" />;
  }

  const pic =
    "https://cdn.discordapp.com/attachments/1196283193821761586/1226005913492787240/noun-cookie-6515787.png?ex=662331fb&is=6610bcfb&hm=7f6469b1debe2c78ed55c6e06dae97bb9d37d9668708a504fe9bee4accafc3e7&";

  return (
    <View style={styles.container}>
      <Image source={{ uri: pic }} style={styles.image} />
      <Text style={styles.title}>Social Sphere</Text>
      <Text style={styles.underText}>Make events, spread ideas!</Text>

      <Button
        text="Create Account"
        onPress={() => {
          router.push("/(auth)/sign-up");
        }}
      ></Button>

      <TouchableOpacity style={styles.button}>
        <Link push href="/(auth)/sign-up">
          <Text style={styles.buttonText}>Login</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginVertical: 5,
  },
  underText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 90,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
  },
  button: {
    backgroundColor: "transparent",
    padding: 20,
    width: 330,
    alignItems: "center",
    borderRadius: 20,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#31A062",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
