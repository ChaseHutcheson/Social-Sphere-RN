import { Text, View } from "@/src/components/Themed";
import Button from "@/src/components/CustomButton";
import { useAuth } from "@/src/context/AuthContext";
import { Feather } from "@expo/vector-icons";

import { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
} from "react-native";

export default function TabOneScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
      }}
    >
      <View style={{ flex: 1, alignItems: "center", marginTop: "5%" }}>
        <Text>Hello</Text>
      </View>
    </SafeAreaView>
  );
}
