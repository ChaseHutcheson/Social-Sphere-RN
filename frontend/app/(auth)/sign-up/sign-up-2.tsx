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

const SignUpScreenTwo = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
    const { isAuthenticated } = useAuth();
    const { setSignUpData } = useSignUpContext();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.title}>Let us get to know you!</Text>
        <View style={styles.formContainer}>
          <Text>{}</Text>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>First Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="John"
              placeholderTextColor="#848484"
              onChangeText={(e) => setFirstName(e)}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Doe"
              placeholderTextColor="#848484"
              onChangeText={(e) => setLastName(e)}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>Birthday</Text>
            <TextInput
              style={styles.textInput}
              placeholder="MM/dd/yyyy"
              placeholderTextColor="#848484"
              onChangeText={(e) => setBirthday(e)}
            />
          </View>
        </View>
        <Button
          text="Continue"
          backgroundColor="#0059FF"
          textColor="#fff"
          onPress={async () => {
            await setSignUpData((prevData) => {
              return {
                ...prevData,
                first_name: firstName,
                last_name: lastName,
                address: null,
                date_of_birth: birthday,
              };
            });
            router.navigate("/(auth)/sign-up/sign-up-3");
          }}
        ></Button>
        <Text style={styles.loginButtonLabel}>Already have an account?</Text>
        <Link href="/(auth)/sign-in">
          <Text style={styles.textButton}>Login!</Text>
        </Link>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SignUpScreenTwo;

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
    marginVertical: 20,
  },
  formContainer: {
    marginVertical: 20,
  },
});
