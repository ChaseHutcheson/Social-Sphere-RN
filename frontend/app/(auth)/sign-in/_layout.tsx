import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{ headerTitle: "Forgot Password" }}
      />
    </Stack>
  );
};

export default StackLayout;
