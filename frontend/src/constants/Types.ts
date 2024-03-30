import axios from "axios";
import Settings from "@/src/config";

const TOKEN_KEY = Settings.SECRET_KEY;
const API_URL = `${Settings.API_HOST}:${Settings.API_PORT}`;

export const backendBase = axios.create({
  baseURL: ` http://${API_URL}/users`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
});

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  date_of_birth: string;
  created_at: string;
}
