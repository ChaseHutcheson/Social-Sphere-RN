import React, { createContext, useContext, useState } from "react";
import { User, backendBase } from "../constants/Types";
import * as SecureStore from "expo-secure-store";

interface AuthData {
  userData: User | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType {
  authData: AuthData;
  setAuthData: (data: AuthData) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    dateOfBirth: string
  ) => Promise<void>;
}

const defaultAuthData: AuthData = {
  userData: null,
  authToken: null,
  isAuthenticated: false,
  isLoading: false,
};

const AuthContext = createContext<AuthContextType>({
  authData: defaultAuthData,
  setAuthData: () => {},
  signIn: async () => {},
  signUp: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [authData, setAuthData] = useState<AuthData>(defaultAuthData);

  const signIn = async (email: string, password: string) => {
    setAuthData({ ...authData, isLoading: true });
    try {
      const tokens = await backendBase.post("/login", {
        email: email,
        password: password,
      });
      const user = await backendBase.get(
        `/me?token=${tokens.data.access_token}`
      );

      await SecureStore.setItemAsync("access_token", tokens.data.access_token);

      setAuthData({
        userData: user.data,
        authToken: tokens.data.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const signUp = async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    dateOfBirth: string
  ) => {
    setAuthData({ ...authData, isLoading: true });
    try {
      const tokens = await backendBase.post("/register", {
        first_name: firstName,
        last_name: lastName,
        username: username,
        date_of_birth: dateOfBirth,
        email: email,
        password: password,
      });
      const user = await backendBase.get(
        `/me?token=${tokens.data.access_token}`
      );

      await SecureStore.setItemAsync("access_token", tokens.data.access_token);

      setAuthData({
        userData: user.data,
        authToken: tokens.data.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
