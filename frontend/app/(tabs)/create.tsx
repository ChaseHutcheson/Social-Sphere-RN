import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import DateTimePicker, {
  Event as DateTimeEvent,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { makeEvent } from "@/api/events";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "react-native-toast-notifications";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";


export default function CreateScreen() {
  const toast = useToast();
  const { authToken, refreshToken } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [datePickerMode, setDatePickerMode] = useState<"date" | "time">("date");

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    if (event.type === "set" && selectedDate) {
      setDeadline(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    const currentDate = new Date();
    if (deadline <= currentDate) {
      Alert.alert(
        "Invalid Deadline",
        "Please choose a deadline that is in the future."
      );
      return;
    }

    const eventData = {
      title,
      content,
      address,
      deadline: deadline.toISOString(),
    };

    // Implement your form submission logic here
    console.log("Submitting event data:", eventData);
    console.log(authToken);
    if (authToken == "" || authToken == null) {
      console.log("No token");
    } else {
      console.log(authToken!);
    }
    makeEvent(authToken!, refreshToken!, eventData);
    toast.show("Task finished successfully", {
      type: "normal",
      placement: "top",
      duration: 4000,
      animationType: "slide-in",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
        />

        <Text style={styles.label}>Content:</Text>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          placeholder="Enter event content"
          multiline
        />

        <Text style={styles.label}>Address:</Text>
        <View style={styles.input}>
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

        <Text style={styles.label}>Deadline:</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setDatePickerMode("date");
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.buttonText}>Pick Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setDatePickerMode("time");
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.buttonText}>Pick Time</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={deadline}
            mode={datePickerMode}
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        <Text style={styles.dateText}>
          {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString()}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  dateText: {
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
