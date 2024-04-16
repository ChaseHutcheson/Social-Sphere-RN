import {
  Animated,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, Redirect, router } from "expo-router";
import { useFonts } from "expo-font";
import Button from "@/components/CustomButton";
import { FadeIn, FadeOut } from 'react-native-reanimated';

const WelcomeScreen = () => {
  const [opacity] = useState(new Animated.Value(0));

  async function fadeIn() {
    Animated.timing(opacity, {
      toValue: 1, 
      duration: 2000,
      useNativeDriver: true
    }).start();
  }

  async function fadeOut() {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    fadeIn();
    setTimeout(() => {
      fadeOut()
      setTimeout(() => {
        router.push("/(auth)/sign-up/sign-up-1");
      }, 2000)
    }, 2000)
  }, []);

  

  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
      }}
    >
      <Animated.View style={{...styles.container, opacity: opacity}}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.underText}>Social Sphere</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontFamily: "OpenSans",
    marginVertical: -10,
    color: "#0059FF",
  },
  underText: {
    fontSize: 50,
    fontFamily: "Itim",
    color: "#0059FF",
  },
});
