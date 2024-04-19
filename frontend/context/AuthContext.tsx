import React, { createContext, useContext, useEffect, useState } from "react";
import { SignUpData, User } from "../constants/Types";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { getMe } from "@/api/users";
import { signIn, signUp } from "@/api/auth";

interface IAuthContext {
  user: User | null;
  signUpData: SignUpData | null;
  authToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (data: User | null) => void;
  setAuthenticated: (state: boolean) => void;
  setAuthToken: (state: string | null) => void;
  setSignUpData: (data: SignUpData | null) => void;
  contextSignIn: (email: string, password: string) => Promise<void>;
  contextSignUp: (
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    address: string | null,
    date_of_birth: string
  ) => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  signUpData: null,
  authToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  setUser(data) {},
  setAuthenticated(state) {},
  setAuthToken(state) {},
  setSignUpData(state) {},
  contextSignIn: async () => {},
  contextSignUp: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [signUpData, setSignUpData] = useState<SignUpData | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  const contextSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const tokens = await signIn(email, password);
      const userData = await getMe(tokens.data.access_token);
      await SecureStore.setItemAsync("access_token", tokens.data.access_token);
      await SecureStore.setItemAsync(
        "refresh_token",
        tokens.data.refresh_token
      );

      let user: User = userData.data;

      setUser(user);
      setAuthToken(tokens.data.access_token);
      setRefreshToken(tokens.data.refresh_token);
      setAuthenticated(true);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error(
            "Request failed with status code:",
            error.response.status,
            "and detail message:",
            error.response.data.detail
          );
          return error.response.data.detail;
        } else {
          console.error("An error occurred:", error.message);
          return error.message;
        }
      } else {
        console.error("An error occurred:", error);
        return error;
      }
    } finally {
      setLoading(false);
    }
  };

  const contextSignUp = async (
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    address: string | null,
    date_of_birth: string
  ) => {
    setLoading(true);
    try {
      await signUp(
        first_name,
        last_name,
        username,
        email,
        password,
        address,
        date_of_birth
      );
      const tokens = await signIn(email, password);
      const user: User = (await getMe(tokens.data.access_token)).data;

      await SecureStore.setItemAsync("access_token", tokens.data.access_token);
      await SecureStore.setItemAsync(
        "refresh_token",
        tokens.data.refresh_token
      );

      setUser(user);
      setAuthToken(tokens.data.access_token);
      setRefreshToken(tokens.data.refresh_token);
      setAuthenticated(true);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error(
            "Request failed with status code:",
            error.response.status,
            "and detail message:",
            error.response.data.detail
          );
          return error.response.data.detail;
        } else {
          console.error("An error occurred:", error.message);
          return error.message;
        }
      } else {
        console.error("An error occurred:", error);
        return error;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUpData,
        authToken,
        refreshToken,
        isAuthenticated,
        isLoading,
        setUser,
        setAuthenticated,
        setAuthToken,
        setSignUpData,
        contextSignIn,
        contextSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
