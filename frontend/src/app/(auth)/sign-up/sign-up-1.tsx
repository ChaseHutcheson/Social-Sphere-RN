import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Link, Redirect } from "expo-router";
import { useFonts } from "expo-font";
import Button from "@/src/components/CustomButton";

const SignUpScreenOne = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { contextSignUp, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/" />;
  }

  return (
    <SafeAreaView
      style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
      }}
    >
      <View style={styles.container}>
          <Text style={styles.title}>
            We'll need some information to get started.
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            onChangeText={(e) => setUsername(e)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            onChangeText={(e) => setEmail(e)}
          />
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            onChangeText={(e) => setPassword(e)}
          />
          <Link href="/(auth)/sign-up">
            <Text style={styles.buttonText}>Already have an account?</Text>
          </Link>
        </View>
    </SafeAreaView>
  );
};

export default SignUpScreenOne;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    width: "85%",
    fontFamily: "OpenSans",
    textAlign: "center",
    color: "#0059FF",
  },
  underText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 90,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
  },
  button: {
    backgroundColor: "transparent",
    padding: 20,
    width: 330,
    alignItems: "center",
    borderRadius: 20,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#31A062",
  },
  textInput: {
    borderRadius: 13,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: 330,
    margin: 5,
    backgroundColor: "#F3F3F3",
  },
  passwordInput: {
    padding: 20,
    width: 330,
    margin: 5,
    marginBottom: 90,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
