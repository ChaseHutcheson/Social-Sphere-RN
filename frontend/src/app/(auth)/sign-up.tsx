import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Appearance,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSignUp } from "@/src/hooks/useSignUp";
import axios from "axios";
import { useAuth } from "@/src/context/AuthContext";
import styles from "@/src/constants/Theme";
import Colors from "@/src/constants/Colors";
import { router } from "expo-router";
import { Linker } from "@/src/utils/Linker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState(""); // JON WAS HERE
  const [lastName, setLastName] = useState(""); // Love you pookie
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { handleSignUp, isLoading, error } = useSignUp();
  const { authData } = useAuth();

  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
        backgroundColor:
          Appearance.getColorScheme() === "light"
            ? Colors.light.background
            : Colors.dark.background,
      }}
    >
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>
              Sign Up to <Text style={{ color: "#6C63FF" }}>Social Sphere</Text>
            </Text>

            <Text style={styles.subtitle}>Make Events and Spread Ideas</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>First Name</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="ascii-capable"
                onChangeText={(firstName) => setFirstName(firstName)}
                placeholder="John"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={firstName}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="ascii-capable"
                onChangeText={(lastName) => setLastName(lastName)}
                placeholder="Doe"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={lastName}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="ascii-capable"
                onChangeText={(username) => setUsername(username)}
                placeholder="JohnDoesntExist19XX"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={username}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email address</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(email) => setEmail(email)}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={email}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={(password) => setPassword(password)}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={password}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Confirm Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={(password) => setPasswordConfirm(password)}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={passwordConfirm}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Birthday</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={(birthday) => setDateOfBirth(birthday)}
                placeholder="yyyy-MM-dd"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={dateOfBirth}
              />
            </View>

            <Text style={{ color: "red", textAlign: "center" }}>
              {errorMsg.toString()}
            </Text>

            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={() => {
                  if (password.trim() != passwordConfirm.trim()) {
                    setErrorMsg("Passwords don't match.");
                  } else {
                    handleSignUp(
                      firstName,
                      lastName,
                      username,
                      email,
                      password,
                      dateOfBirth
                    );
                  }
                }}
              >
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Sign Up</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          style={{ marginTop: "auto" }}
        >
          <Text style={styles.formFooter}>
            Already have an account?{" "}
            <Text style={{ textDecorationLine: "underline" }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
