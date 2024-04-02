import { StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import EditScreenInfo from "@/src/components/EditScreenInfo";
import { Text, View } from "@/src/components/Themed";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect } from "react";
import { Linker } from "@/src/utils/Linker";
import { authBase, userBase } from "@/src/constants/Types";
import { useSignIn } from "@/src/hooks/useSignIn";

export default function TabOneScreen() {
  const { authData, setAuthData } = useAuth();
  const { handleSignIn, error, isLoading } = useSignIn();

  useEffect(() => {
    async function checkStoredToken() {
      let isTokenExpired: any;
      let userDataRes: any;
      if (authData.isAuthenticated) return;
      console.log("User Auth: ", authData.isAuthenticated);
      const past_access_token = await SecureStore.getItemAsync("access_token");
      console.log("Previous Token: ", past_access_token);
      if (past_access_token !== null) {
        isTokenExpired = await authBase
          .get(`/is-token-expired?access_token=${past_access_token}`)
          .then((res) => res.data.result);
        if (isTokenExpired === false) {
          userDataRes = (await userBase.get(`/me?token=${past_access_token}`))
            .data;
          console.log(userDataRes);
          setAuthData({
            userData: userDataRes,
            authToken: past_access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      }
    }
    checkStoredToken();
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
