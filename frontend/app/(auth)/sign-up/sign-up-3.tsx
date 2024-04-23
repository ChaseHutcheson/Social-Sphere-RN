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
import { Link, Redirect, router } from "expo-router";
import { useFonts } from "expo-font";
import Button from "@/components/CustomButton";
import {
  KeyboardAwareScrollView,
  KeyboardAwareSectionList,
} from "react-native-keyboard-aware-scroll-view";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignUpContext } from "@/context/SignUpContext";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const SignUpScreenThree = () => {
  const [address, setAddress] = useState("");
  const { isAuthenticated, contextSignUp } = useAuth();
  const { signUpData, setSignUpData } = useSignUpContext();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Would you like to set your home address?</Text>
      <Text style={styles.underTitle}>
        We will use your address as the default location when creating events.
      </Text>
      <View style={styles.formContainer}>
        <View style={styles.textInputContainer}>
          <Text style={styles.textInputLabel}>Address</Text>
          <View style={styles.textInput}>
            <GooglePlacesAutocomplete
              suppressDefaultStyles
              placeholder="Enter event address"
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                setAddress(data.description);
              }}
              query={{
                key: "AIzaSyDd0YxufG2QqTaN5JG00q_oT2lmbg-czWA",
                language: "en",
              }}
              onFail={(error) => {
                console.log(error);
              }}
            />
          </View>
        </View>
      </View>
      <Button
        text="Sign Up!"
        backgroundColor="#0059FF"
        textColor="#fff"
        onPress={async () => {
          console.log(signUpData);
          await setSignUpData({
            first_name: signUpData?.first_name,
            last_name: signUpData?.last_name,
            username: signUpData?.username,
            email: signUpData?.email,
            password: signUpData?.password,
            address: address,
            date_of_birth: signUpData?.date_of_birth,
          });
          console.log(signUpData);
          await contextSignUp(
            signUpData?.first_name!,
            signUpData?.last_name!,
            signUpData?.username!,
            signUpData?.email!,
            signUpData?.password!,
            address!,
            signUpData?.date_of_birth!
          );
        }}
      ></Button>

      <Text style={styles.loginButtonLabel}>Already have an account?</Text>
      <Link href="/(auth)/sign-in">
        <Text style={styles.textButton}>Login!</Text>
      </Link>
    </View>
  );
};

export default SignUpScreenThree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
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
    backgroundColor: "#F5F5F5",
    borderColor: "#F5F5F5",
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
