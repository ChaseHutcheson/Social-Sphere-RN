import { useAuth } from "@/src/context/AuthContext";
import { useSignIn } from "@/src/hooks/useSignIn";
import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Appearance,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "@/src/constants/Colors";
import { Linker } from "@/src/utils/Linker";
import styles from "@/src/constants/Theme";

export default function SignInScreen() {
  // JON WAS HERE | Love you pookie
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignIn, isLoading, error } = useSignIn();
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
              Sign in to <Text style={{ color: "#6C63FF" }}>Social Sphere</Text>
            </Text>

            <Text style={styles.subtitle}>Make Events and Spread Ideas</Text>
          </View>

          <View style={styles.form}>
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

            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={() => {
                  handleSignIn(email, password);
                }}
              >
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Sign in</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLink}>Forgot password?</Text>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => {
            Linker("(auth)/sign-up");
          }}
          style={{ marginTop: "auto" }}
        >
          <Text style={styles.formFooter}>
            Don't have an account?{" "}
            <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
