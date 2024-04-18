import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSignUpContext } from "@/context/SignUpContext";
import { Link, Redirect, router } from "expo-router";
import { useFonts } from "expo-font";
import Button from "@/components/CustomButton";
import {
  KeyboardAwareScrollView,
} from "react-native-keyboard-aware-scroll-view";
import { SignUpData } from "@/constants/Types";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpScreenOne = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated } = useAuth();
  const { setSignUpData } = useSignUpContext()

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
        <Text style={styles.title}>
          We'll need some information to get started.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              placeholder="JohnDoe1970"
              placeholderTextColor="#848484"
              onChangeText={(e) => setUsername(e)}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="JohnDoe1970@email.com"
              placeholderTextColor="#848484"
              onChangeText={(e) => setEmail(e)}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="•••••••••••••••"
              placeholderTextColor="#848484"
              secureTextEntry={true}
              onChangeText={(e) => setPassword(e)}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="•••••••••••••••"
              placeholderTextColor="#848484"
              secureTextEntry={true}
              onChangeText={(e) => setPassword(e)}
            />
          </View>
        </View>
        <Button
          text="Continue"
          backgroundColor="#0059FF"
          textColor="#fff"
          onPress={() => {
            router.push("/(auth)/sign-up/sign-up-2");
            setSignUpData((prevData) => {
              return {
                ...prevData,
                username: username,
                email: email,
                password: password,
              };
            });
          }}
        ></Button>
        <Text style={styles.loginButtonLabel}>Already have an account?</Text>
        <Link href="/(auth)/sign-in">
          <Text style={styles.textButton}>Login!</Text>
        </Link>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreenOne;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    marginTop: 75,
    fontSize: 28,
    width: "90%",
    fontFamily: "OpenSans",
    textAlign: "center",
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
    backgroundColor: "#F5F5F5",
    borderColor: "#F5F5F5",
  },
  textInputLabel: {
    fontFamily: "OpenSans",
    color: "#848484",
    marginLeft: 15,
  },
  textInputContainer: {
    marginVertical: 10,
  },
  formContainer: {
    marginVertical: 20,
  },
});
