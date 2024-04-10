import axios from "axios";
import { API_URL } from "@/src/constants/Config";
import validateEmail from "@/src/utils/ValidateEmail";

export interface UpdateUserSchema {
  email?: string;
  username?: string;
  password?: string;
}

export const signIn = async (email: string, password: string) => {
  const isEmailValid = validateEmail(email);
  if (isEmailValid) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password,
      });
      console.log("Response Successful!");
      return response.data;
    } catch (error) {
      console.log(`${API_URL}/register`);
      console.error(error);
      return error;
    }
  } else {
    const errorMsg = { Error: "Email isn't valid." };
    console.log(errorMsg);
    return errorMsg;
  }
};

export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  const isEmailValid = validateEmail(email);
  if (isEmailValid) {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email: email,
        username: username,
        password: password,
      });
      console.log("Response Successful!");
      return response.data;
    } catch (error) {
      console.log(`${API_URL}/register`);
      console.error(error);
      return error;
    }
  } else {
    const errorMsg = { Error: "Email isn't valid." };
    console.log(errorMsg);
    return errorMsg;
  }
};

export const forgotPassword = async (email: string) => {
  axios.post(`${API_URL}/forgot-password`, {
    email: email,
  });
};

export const updateProfile = async (id: number, update: UpdateUserSchema) => {
  try {
    const response = await axios.patch(`${API_URL}/users/me/update`, update);
    console.log("Profile update successful!");
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
