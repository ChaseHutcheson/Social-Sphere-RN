import { Platform } from "react-native";

const API_HOST =
  Platform.OS === "android" ? "http://10.0.2.2" : "http://localhost";

const API_PORT = "3000";

export const API_URL = `${API_HOST}:${API_PORT}`;
