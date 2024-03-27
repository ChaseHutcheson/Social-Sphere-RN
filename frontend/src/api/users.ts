import axios from "axios";
import Settings from "@/src/config"
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = Settings.SECRET_KEY;
const API_URL = `${Settings.API_HOST}:${Settings.API_PORT}`;

const users = axios.create({
  baseURL: ` http://${API_URL}/users`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
});

let data;

const loginUser = async (email: string, password: string) => {
    try {
        users
          .post("/login", {
            "email": email,
           "password": password,
          })
          .then((res) => {
            console.log(res.data)
            SecureStore.setItemAsync("access_token", res.data.access_token)
            })
          .catch((err) => console.error(err));
    } catch (error) {
        console.error(error)
    }
}

export default loginUser