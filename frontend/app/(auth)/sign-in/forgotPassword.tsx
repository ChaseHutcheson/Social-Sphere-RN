import { forgotPassword, resetPassword } from "@/api/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeText, setCodeText] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleForgotPassword = async () => {
    const response = await forgotPassword(email);
    if (response.isSuccessful) {
      setCodeText("Code successfully sent.");
    }
  };

  const handleResetPassword = () => {
    resetPassword(email, code, newPassword);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>

        {/* Email input field */}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text>{codeText}</Text>
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Get Code</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Enter code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />

        {/* New password input field */}
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
        />

        {/* Submit button */}
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0059FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;
