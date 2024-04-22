import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, Redirect, router } from "expo-router";
import Button from "@/components/CustomButton";
import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import { getMe } from "../api/users";
import { User } from "../constants/Types";
import { checkToken } from "@/utils/checkToken";
import { refreshAccessToken } from "@/utils/refreshAccessToken";

export default function App() {
  const { isAuthenticated, setUser, setAuthenticated, setAuthToken } =
    useAuth();

  useEffect(() => {
    async function authenticateUser() {
      try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        const refreshToken = await SecureStore.getItemAsync("refresh_token");

        if (!accessToken || !refreshToken) {
          console.log("No access token or refresh token found.");
          return;
        }

        console.log("Access token and refresh token found.");

        // Check if the access token is expired
        const tokenResponse = await checkToken(accessToken);

        const isTokenExpired = tokenResponse?.data.result;
        console.log("Is token expired:", isTokenExpired);

        if (isTokenExpired) {
          console.log("Access token is expired. Refreshing...");

          try {
            const newAccessToken = await refreshAccessToken(refreshToken);

            console.log("New access token:", newAccessToken);

            if (newAccessToken) {
              await SecureStore.setItemAsync("access_token", newAccessToken);
              console.log("New access token stored successfully.");
            } else {
              console.log("Failed to refresh access token.");
            }
          } catch (error) {
            console.error("Error refreshing access token:", error);
          }
        }

        // Get user data
        const userData = await getMe(accessToken);

        if (userData.status >= 200 && userData.status <= 299) {
          const user = userData.data;
          setUser(user);
          setAuthenticated(true);
          setAuthToken(accessToken);
        } else {
          console.error("Failed to fetch user data:", userData.statusText);
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    }

    authenticateUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      return router.push("/(tabs)/");
    }
  });

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/SplashScreenIcon.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Social Sphere</Text>
      <Text style={styles.underText}>Make events, spread ideas!</Text>

      <Button
        text="Get Started"
        textColor="#0059FF"
        backgroundColor="white"
        onPress={() => {
          router.push("/(auth)/sign-up");
        }}
      ></Button>

      <TouchableOpacity style={styles.button}>
        <Link push href="/(auth)/sign-in">
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
    backgroundColor: "#0059FF",
  },
  title: {
    fontSize: 60,
    fontFamily: "Itim",
    marginTop: 5,
    color: "white",
  },
  underText: {
    fontSize: 31,
    fontFamily: "Itim",
    color: "white",
    marginTop: -20,
    marginBottom: 90,
  },
  image: {
    height: "40%",
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
    fontSize: 25,
    fontFamily: "OpenSans",
    color: "#fff",
    textDecorationLine: "underline",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
