import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { SignUpProvider } from "@/context/SignUpContext";

const StackLayout = () => {
  return (
    <SignUpProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up-1"
          options={{
            headerShown: true,
            headerTitle: "Sign Up",
          }}
        />
        <Stack.Screen
          name="sign-up-2"
          options={{
            headerShown: true,
            headerTitle: "Sign Up",
          }}
        />
        <Stack.Screen
          name="sign-up-3"
          options={{
            headerShown: true,
            headerTitle: "Sign Up",
          }}
        />
      </Stack>
    </SignUpProvider>
  );
};

export default StackLayout;
