import { StyleSheet } from "react-native";

import EditScreenInfo from "@/src/components/EditScreenInfo";
import { Text, View } from "@/src/components/Themed";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect } from "react";
import { Linker } from "@/src/utils/Linker";

export default function TabOneScreen() {
  const { authData } = useAuth();

  useEffect(() => {
    if (!authData.isAuthenticated) Linker("/(auth)/");
    else Linker("/(tabs)/");
  }, [authData.isAuthenticated]);

  return (
    <View style={styles.container}>
      <Text>{authData.isAuthenticated ? "True" : "False"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
