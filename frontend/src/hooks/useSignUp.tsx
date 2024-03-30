import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useSignUp = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    dateOfBirth: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(firstName, lastName, username, email, password, dateOfBirth);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignUp, isLoading, error };
};
