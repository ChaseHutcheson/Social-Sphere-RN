import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { API_URL } from "@/constants/Config";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/constants/Types";

export const getMe = async (access_token: string): Promise<AxiosResponse<any>> => {
  const response = await axios
    .get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })

  return response  ;
};

export const logOut = async (
  access_token: string
): Promise<AxiosResponse<any>> => {
  const response = await axios.post(`${API_URL}/users/logout`,{}, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  SecureStore.deleteItemAsync("access_token")
  SecureStore.deleteItemAsync("refresh_token")

  return response;
};
