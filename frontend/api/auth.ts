import axios, { AxiosResponse } from "axios";
import { API_URL } from "@/constants/Config";
import validateEmail from "@/utils/ValidateEmail";
import { hashData } from "@/utils/hashData";

export interface UpdateUserSchema {
  email?: string;
  username?: string;
  password?: string;
}

export const signIn = async (
  email: string,
  password: string
): Promise<AxiosResponse<any>> => {
  const isEmailValid = validateEmail(email);
  if (isEmailValid) {
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      const response = await axios.post(`${API_URL}/users/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  } else {
    const errorMsg = { Error: "Email isn't valid." };
    console.error(errorMsg);
    return Promise.reject(new Error("Email isn't valid."));
  }
};

export const signUp = async (
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  password: string,
  address: string | null,
  date_of_birth: string
): Promise<AxiosResponse<any>> => {
  function convertDateFormat(dateString: string) {
    // Split the input date string by "/"
    const [month, day, year] = dateString.split("/");

    // Combine the year, month, and day in the format "yyyy-MM-dd"
    const newDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    return newDateString;
  }

  const isEmailValid = await validateEmail(email);
  console.log(isEmailValid);
  console.log(email);
  if (isEmailValid) {
    try {
      console.log(convertDateFormat(date_of_birth));
      const response = await axios.post(`${API_URL}/users/register`, {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        password: password,
        address: address,
        date_of_birth: convertDateFormat(date_of_birth),
      });
      return response; // Return the full response object
    } catch (error) {
      console.error(error);
      return Promise.reject(error); // Return a rejected promise with the error
    }
  } else {
    const errorMsg = { Error: "Email isn't valid." };
    console.log(errorMsg);
    return Promise.reject(new Error("Email isn't valid."));
  }
};
export const forgotPassword = async (email: string) => {
  const request = await axios.post(
    `${API_URL}/auth/password/forgot?email=${email}`,
    {}
  );
  return request;
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const hashedEmail = hashData(email);
  const hashedCode = hashData(code);

  try {
    const response = await axios.post(`${API_URL}/auth/password/reset`, {
      hashed_email: hashedEmail,
      hashed_code: hashedCode,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error("Password reset failed");
  }
};

export const updateProfile = async (id: number, update: UpdateUserSchema) => {
  try {
    const response = await axios.patch(`${API_URL}/users/me/update`, update);
    console.log("Profile update successful!");
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
