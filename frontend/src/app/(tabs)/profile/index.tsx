import { StyleSheet } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { useAuth } from "@/src/context/AuthContext";

export default function ProfileScreen() {
  const { authData } = useAuth();
  return (
    <View style={styles.container}>
      <Text>{authData.userData?.id}</Text>
      <Text>{authData.userData?.username}</Text>
      <Text>{authData.userData?.created_at.split("T")[0]}</Text>
      <Text>{authData.userData?.date_of_birth}</Text>
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
