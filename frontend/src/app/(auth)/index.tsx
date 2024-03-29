import { View, Text, SafeAreaView, Platform, StatusBar, TextInput, StyleSheet, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Login = () => {
    const [firstName, setFirstName] = useState("");                                                                                                                                             // JON WAS HERE
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");


    return (
      <SafeAreaView
        style={{
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View style={styles.container}>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              onChangeText={(text: string) => setFirstName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              onChangeText={(text: string) => setLastName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={(text: string) => setUsername(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={(text: string) => setEmail(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(text: string) => setPassword(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
            />
            <TextInput
              style={styles.input}
              placeholder="Birthday (yyyy-MM-dd)"
              onChangeText={(text: string) => setDateOfBirth(text)}
            />
            <Button onPress={login} title="Sign In" />
            <Button onPress={register} title="Sign Up" />
          </View>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    form: {

    },
    input: {

    }
})

export default Login