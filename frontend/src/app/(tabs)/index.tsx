import { StyleSheet } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";
import { getNewestEvents } from "@/src/api/events";

export default function HomeScreen() {
  const { user, isAuthenticated, authToken } = useAuth();
  const [newestEvents, setNewestEvents] = useState();
  const page: number = 1;

  useEffect(() => {
    async function getNewestEventsEffect(page: number, token: string) {
      if (isAuthenticated) {
        try {
          const eventsResponse = await getNewestEvents(page, token);
          setNewestEvents(eventsResponse?.data);
        } catch (error) {
          console.error(error);
        }
      }
    }
    getNewestEventsEffect(page, authToken!);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(newestEvents)}</Text>
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
