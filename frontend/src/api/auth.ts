import axios from "axios";
import { API_URL } from "@/src/constants/Config";
import validateEmail from "@/src/utils/ValidateEmail";
const querystring = require("query-string")

export interface UpdateUserSchema {
  email?: string;
  username?: string;
  password?: string;
}

export const signIn = async (email: string, password: string) => {
  const isEmailValid = validateEmail(email);
  if (isEmailValid) {
    try {
      console.log("Running request")
      console.log(`${API_URL}/users/login`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        username: email,
        password: password,
      });
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', password)
      const response = await axios.post(`${API_URL}/users/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("Response Successful!");
      console.log(response.data)
      return response.data;
    } catch (error) {
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
      const response = await axios.post(`${API_URL}/users/register`, {
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

export const checkToken = async (
  token: string,
) => {
    try {
      const response = await axios.get(`${API_URL}/auth/is-token-expired`, {
        headers: {"Authorization": `Bearer ${token}`}
      });
      console.log("Response Successful!");
      return response.data.result;
    } catch (error) {
      console.log(`${API_URL}/register`);
      console.error(error);
      return error;
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
