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
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up-2"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up-3"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SignUpProvider>
  );
};

export default StackLayout;
