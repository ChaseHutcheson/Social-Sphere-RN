import { View, Text } from "react-native";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@/constants/Config";

export const checkToken = async (
  access_token: string
): Promise<AxiosResponse<any>> => {
  const response = await axios.get(`${API_URL}/auth/is-token-expired`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return response;
};
