import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import React from "react";

const SearchPage = () => {
  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View>
        <Text>SearchPage</Text>
      </View>
    </SafeAreaView>
  );
};

export default SearchPage;
