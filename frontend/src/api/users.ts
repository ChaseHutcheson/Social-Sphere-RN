import axios, { Axios, AxiosError } from "axios";
import { API_URL } from "@/src/constants/Config";

export const getMe = async (access_token: string) => {
  const response = await axios
    .get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    .catch((error: AxiosError) => {
      console.error(error);
    });

  return response?.data;
};
