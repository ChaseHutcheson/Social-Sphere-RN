import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import React from "react";

const CreatePage = () => {
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View>
        <Text>CreatePage</Text>
      </View>
    </SafeAreaView>
  );
};

export default CreatePage;
