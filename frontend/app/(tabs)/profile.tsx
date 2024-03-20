import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import React from "react";

const ProfilePage = () => {
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View>
        <Text>ProfilePage</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;
