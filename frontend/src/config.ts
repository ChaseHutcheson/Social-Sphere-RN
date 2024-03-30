import { Platform } from "react-native";

export default {
  API_HOST: Platform.OS === "android" ? "10.0.2.2" : "localhost",
  API_PORT: "8000",
  SECRET_KEY: "HLBn0v0m3Uo0ZknwzqLRr3qYe6IeHCaf",
};
