import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import React from "react";

const AttendingPage = () => {
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View>
        <Text>AttendingPage</Text>
      </View>
    </SafeAreaView>
  );
};

export default AttendingPage;
