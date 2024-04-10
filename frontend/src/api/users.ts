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

export const getAll = async (access_token: string) => {
  const response = await axios
    .get(`${API_URL}/users/all`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    .catch((error: AxiosError) => {
      console.error(error);
    });

  return response?.data;
};

export const getById = async (access_token: string, id: number) => {
  const response = await axios
    .get(`${API_URL}/users/me/${id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    .catch((error: AxiosError) => {
      console.error(error);
    });

  return response?.data;
};
