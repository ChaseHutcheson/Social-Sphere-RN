import { StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import EditScreenInfo from "@/src/components/EditScreenInfo";
import { Text, View } from "@/src/components/Themed";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect } from "react";
import { Linker } from "@/src/utils/Linker";
import { authBase, userBase } from "@/src/constants/Types";
import { useSignIn } from "@/src/hooks/useSignIn";
import { openDatabase } from "expo-sqlite";
import Settings from "@/src/config"

export default function TabOneScreen() {
  const { authData, setAuthData } = useAuth();
  const { handleSignIn, error, isLoading } = useSignIn();

  useEffect(() => {
    async function checkStoredToken() {
      if (authData.isAuthenticated) {
        console.log("Already authenticated, skipping token check...");
        Linker("(tabs)");
        return;
      } else {
        console.log("Not authenticated, beginning token check...");
        let isTokenExpired: any;
        let userDataRes: any;
        const past_access_token = await SecureStore.getItemAsync(
          "access_token"
        );
        if (past_access_token !== null) {
          console.log("Access token found!");
          isTokenExpired = await authBase
            .get(`/is-token-expired?access_token=${past_access_token}`)
            .then((res) => res.data.result);
          if (isTokenExpired === false) {
            userDataRes = (await userBase.get(`/me?token=${past_access_token}`))
              .data;
            console.log("User data recieved, adding to AuthData");
            setAuthData({
              userData: userDataRes,
              authToken: past_access_token,
              isAuthenticated: true,
              isLoading: false,
            });
            const db = openDatabase("testDB.db")
            const readOnly = true;
            await db.transactionAsync(async (tx) => {
              const result = await tx.executeSqlAsync(
                "CREATE TABLE events (post_id: INTEGER, user_id: INTEGER, user_name: VARCHAR(255), title: VARCHAR(255), content: VARCHAR(255), address: VARCHAR(255), latitude: DECIMAL, longitude: DECIMAL, created_at: VARCHAR(255), attendees: INTEGER, deadline: VARCHAR(255))", []);
              console.log("Count:", result.rows[0]["COUNT(*)"]);
            }, readOnly);
            Linker("(tabs)");
          } else {
            console.log("Token expired, redirecting to login...");
            Linker("(auth)");
          }
        } else {
          console.log("No access token found, redirecting to login...");
          Linker("(auth)");
        }
      }
    }
    checkStoredToken();
  }, [authData.isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>
        <Text style={{textAlign: "left"}}>Events Near You</Text>
      </View>
      <View style={styles.container}>
        <Text>Events Near You</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
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
