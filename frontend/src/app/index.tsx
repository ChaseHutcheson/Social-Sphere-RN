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
