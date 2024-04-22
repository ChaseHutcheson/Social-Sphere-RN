import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Link, Redirect } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/CustomButton";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const { contextSignIn, isAuthenticated } = useAuth(); // Get error from context

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/" />;
  }

  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        ...styles.container,
      }}
    >
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.aboveTitle}>Welcome back to</Text>
        <Text style={styles.title}>Social Sphere</Text>
        <View style={styles.formContainer}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="JohnDoe1970@email.com"
              placeholderTextColor="#848484"
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="•••••••••••••••"
              placeholderTextColor="#848484"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Sign In button */}
        <Button
          text="Sign In!"
          backgroundColor="#0059FF"
          textColor="#fff"
          onPress={() => {
            // Call contextSignIn and handle error
            contextSignIn(email, password).catch((error) => {
              if (error.response.status === 400) {
                // Set error message
                setErrorMessage("Invalid credentials. Please try again.");
              }
            });
          }}
        />

        {/* Display error message if exists */}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        {/* Forgot Password button */}
        <Link href="/(auth)/sign-in/forgotPassword">
          <Text style={styles.forgotPasswordButton}>Forgot Password?</Text>
        </Link>

        {/* Navigation to Sign-Up screen */}
        <Text style={styles.loginButtonLabel}>Don't have an account?</Text>
        <Link href="/(auth)/sign-up/">
          <Text style={styles.textButton}>Sign Up!</Text>
        </Link>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  aboveTitle: {
    marginTop: 100,
    fontSize: 30,
    fontFamily: "OpenSans",
    marginBottom: -10,
    color: "#0059FF",
  },
  title: {
    fontSize: 50,
    fontFamily: "Itim",
    color: "#0059FF",
  },
  loginButtonLabel: {
    marginVertical: 10,
    fontFamily: "OpenSans",
    fontSize: 17,
    fontWeight: "600",
  },
  textButton: {
    fontFamily: "OpenSans",
    fontSize: 17,
    textDecorationLine: "underline",
    fontWeight: "600",
    color: "#0059FF",
  },
  textInput: {
    color: "#848484",
    fontFamily: "OpenSans",
    borderRadius: 13,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 330,
    margin: 5,
    backgroundColor: "#F3F3F3",
    borderColor: "#F3F3F3",
  },
  textInputLabel: {
    fontFamily: "OpenSans",
    color: "#848484",
    marginLeft: 15,
  },
  textInputContainer: {
    marginVertical: 20,
  },
  formContainer: {
    marginVertical: 20,
  },
  forgotPasswordButton: {
    marginVertical: 10,
    fontFamily: "OpenSans",
    fontSize: 17,
    fontWeight: "600",
    textDecorationLine: "underline",
    color: "#0059FF",
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
});
