import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Link, Redirect } from "expo-router";
import Button from "@/src/components/CustomButton";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { contextSignIn, isAuthenticated } = useAuth();

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
        <Text style={styles.title}>Login</Text>
        <Text style={styles.underText}>Double the meals, double the hope.</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email Address"
          onChangeText={(e) => setEmail(e)}
        ></TextInput>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={(e) => setPassword(e)}
        />
        <Button
          text="Login"
          onPress={() => {
            contextSignIn(email, password);
          }}
        ></Button>
        <Link href="/(auth)/sign-up/">
          <Text style={styles.buttonText}>Dont have an account?</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginVertical: 5,
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
    borderColor: "#828282",
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    width: 330,
    margin: 5,
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
