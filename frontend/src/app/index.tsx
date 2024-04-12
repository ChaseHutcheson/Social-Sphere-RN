import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Link, Redirect, router } from "expo-router";
import Button from "@/src/components/CustomButton";
import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import { checkToken } from "../api/auth";
import { getMe } from "../api/users";
import { User } from "../constants/Types";

export default function App() {
  const { isAuthenticated, setUser, setAuthenticated } = useAuth();

  useEffect(() => {
    async function checkStoredToken() {
      const access_token = await SecureStore.getItemAsync("access_token");
      if (access_token != null) {
        console.log("Access token found.");
        const refresh_token = await SecureStore.getItemAsync("refresh_token");
        if (refresh_token != null) {
          console.log("Refresh token found.");
          const isTokenExpired = await checkToken(access_token);
          if (!isTokenExpired?.data.result) {
            console.log("Token still valid. Beginning user data request.")
            const userData = await getMe(access_token);
            if (userData.status >= 200 && userData.status <= 299) {
              const user: User = userData.data;
              console.log(user);
              setUser(user);
              setAuthenticated(true);
            } else {
              console.error(userData.statusText);
            }
          } else {
            console.log("Access token expired. Beginning refresh.");

          }
        } else {
          console.log("No refresh token found.");
        }
      } else {
        console.log("No access token found.")
      }
    }
    checkStoredToken();
  }, []);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/" />;
  }

  const pic =
    "https://cdn.discordapp.com/attachments/1196283193821761586/1226005913492787240/noun-cookie-6515787.png?ex=662331fb&is=6610bcfb&hm=7f6469b1debe2c78ed55c6e06dae97bb9d37d9668708a504fe9bee4accafc3e7&";

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
