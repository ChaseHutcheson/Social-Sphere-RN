import { View, Text } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";

const StackLayout = () => {
  const params = useLocalSearchParams();
  return (
    <Stack>
      <Stack.Screen
        name="eventListingScreen"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default StackLayout;
