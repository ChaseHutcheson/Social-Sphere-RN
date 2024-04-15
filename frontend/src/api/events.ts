import axios, { AxiosResponse } from "axios";
import { API_URL } from "@/src/constants/Config";
import validateEmail from "@/src/utils/ValidateEmail";
import { SignUpData } from "../constants/Types";
import { useAuth } from "../context/AuthContext";
const querystring = require("query-string");

export const getNewestEvents = async (page: number, token: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/events/newest-events?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {}
};
