import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Settings from "../config";

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
}

interface AuthContextProps {
  authState: AuthState;
  onSignUp: (
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    date_of_birth: string
  ) => Promise<any>;
  onSignIn: (email: string, password: string) => Promise<any>;
  onSignOut: () => Promise<any>;
}

const TOKEN_KEY = Settings.SECRET_KEY;
const API_URL = `${Settings.API_HOST}:${Settings.API_PORT}`;

const AuthContext = createContext<AuthContextProps>({
  authState: { token: null, authenticated: null },
  onSignUp: async () => {},
  onSignIn: async () => {},
  onSignOut: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        setAuthState({ token, authenticated: true });
      }
    };
    loadToken();
  }, []);

  const register = async (
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    date_of_birth: string
  ) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        first_name,
        last_name,
        username,
        email,
        password,
        date_of_birth,
      });
      return response.data;
    } catch (error: any) {
      console.error("Registration Error:", error);
      throw error.response?.data?.msg || "Registration failed";
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      const { access_token } = response.data;
      if (access_token) {
        setAuthState({ token: access_token, authenticated: true });
        await SecureStore.setItemAsync(TOKEN_KEY, access_token);
        return response.data;
      } else {
        throw new Error("Unexpected response from the server");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      throw error.response?.data?.msg || "Login failed";
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_URL}/users/logout?access_token=${authState.token}`
      );
      setAuthState({ token: null, authenticated: false });
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error: any) {
      console.error("Logout Error:", error);
      throw error.response?.data?.msg || "Logout failed";
    }
  };

  const authContextValue: AuthContextProps = {
    authState,
    onSignUp: register,
    onSignIn: login,
    onSignOut: logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
