import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { API_URL } from "@/constants/Config";

export const getMe = async (access_token: string): Promise<AxiosResponse<any>> => {
  const response = await axios
    .get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })

  return response  ;
};
