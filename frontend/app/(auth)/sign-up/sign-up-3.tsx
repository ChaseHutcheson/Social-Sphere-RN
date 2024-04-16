import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
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
import { useAuth } from "@/context/AuthContext";
import { Link, Redirect, router } from "expo-router";
import { useFonts } from "expo-font";
import Button from "@/components/CustomButton";
import {
  KeyboardAwareScrollView,
  KeyboardAwareSectionList,
} from "react-native-keyboard-aware-scroll-view";
import * as SecureStore from "expo-secure-store";

const SignUpScreenThree = () => {
  const [address, setAddress] = useState("");
  const { signUpData, setSignUpData, contextSignUp, isAuthenticated } =
    useAuth();

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
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.title}>
          Would you like to set your home address?
        </Text>
        <Text style={styles.underTitle}>
          We will use your address as the default location when creating events.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="123 Main Street"
              placeholderTextColor="#848484"
              onChangeText={(e) => setAddress(e)}
            />
          </View>
        </View>
        <Button
          text="Sign Up!"
          backgroundColor="#0059FF"
          textColor="#fff"
          onPress={() => {
            setSignUpData({
              first_name: signUpData?.first_name,
              last_name: signUpData?.last_name,
              username: signUpData?.username,
              email: signUpData?.email,
              password: signUpData?.password,
              address: address,
              date_of_birth: signUpData?.date_of_birth,
            });
            contextSignUp(
              signUpData?.first_name!,
              signUpData?.last_name!,
              signUpData?.username!,
              signUpData?.email!,
              signUpData?.password!,
              signUpData?.address!,
              signUpData?.date_of_birth!
            );
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

export default SignUpScreenThree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 75,
    fontSize: 28,
    width: "90%",
    fontFamily: "OpenSans",
    textAlign: "center",
    color: "#0059FF",
  },
  underTitle: {
    marginTop: 35,
    fontSize: 18,
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
    backgroundColor: "#F3F3F3",
    borderColor: "#F3F3F3",
  },
  textInputLabel: {
    fontFamily: "OpenSans",
    color: "#848484",
    marginLeft: 15,
  },
  textInputContainer: {
    marginVertical: 50,
  },
  formContainer: {
    marginVertical: 20,
  },
});
