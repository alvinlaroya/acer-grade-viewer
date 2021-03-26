import React, { Component, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import {Picker} from '@react-native-picker/picker';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
/* import { firebase } from '../../firebase'; */
import { Appbar, Button, TextInput, IconButton, Snackbar } from "react-native-paper";
/* import "firebase/auth"; */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

/* var background = require('./assets/citybackground.jpg'); */
var logo = require("../icon.png");
import firebase from "firebase/app";
import { fb } from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const db = fb.firestore();

const AddSubject = ({navigation}) => {
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);

  const saveSubject = () => {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp;
    if(subject === "") {
        setSnackbarError(true);
    } else {
        db.collection("subjects")
        .add({
            name: subject,
            createdAt: timestamp(),
            teachersCount: 0,
            type: type,
        })
        .then(function (docRef) {
            navigation.navigate("Subjects")
        });
    }
  };

  const onDismissSnackBar = () => setSnackbarError(false);

  return (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <View style={{backgroundColor: 'white', marginTop: Constants.statusBarHeight}}>
        <IconButton
          icon="arrow-left"
          color="gray"
          size={30}
          onPress={() => navigation.goBack(null)}
          style={{ marginTop: 10 }}
        />
      </View>
      <View style={styles.container}>
        <View style={{ height: 100, width: "95%" }}>
          <TextInput
            mode="outlined"
            label="Subject Name"
            onChangeText={(subject) => setSubject(subject)}
          />
          <Picker
              selectedValue={type}
              style={{ height: 50, width: '100%', marginTop: 20}}
              onValueChange={(itemValue, itemIndex) => setType(itemValue)}>
                  <Picker.Item label="Select Type" value="Stage Type" enabled={false} />
                  <Picker.Item label="Elementary" value="elem" enabled={false} />
                  <Picker.Item label="Junior Highschool" value="jr" enabled={false} />
                  <Picker.Item label="Senior Highschool" value="sr" enabled={false} />
          </Picker>
          <Button
            icon="content-save-outline"
            mode="contained"
            contentStyle={{ height: 55 }}
            color="#05a148"
            style={{ marginTop: 10, borderRadius: 25 }}
            onPress={saveSubject}
          >
            Save Subject
          </Button>
        </View>
      </View>
      <Snackbar
        visible={snackbarError}
        onDismiss={onDismissSnackBar}
        style={{backgroundColor: 'red'}}
        action={{
          label: 'Close',
          onPress: () => {
            // Do something
          },
        }}>
            Empty Subject. Please Enter Subject!
      </Snackbar>
    </>
  );
};

export default AddSubject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  logoProfile: {
    width: 145,
    height: 145,
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 15,
  },
  title: {
    color: "black",
    marginBottom: 0,
    fontSize: 15,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  usernameInput: {
    fontSize: 15,
    flex: 1,
    borderRadius: 25,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  passwordInput: {
    fontSize: 15,
    flex: 1,
    borderRadius: 25,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  iconInput: {
    padding: 10,
  },
  appButtonContainer: {
    elevation: 4,
    marginTop: 15,
    backgroundColor: "#05a148",
    borderRadius: 25,
    width: "100%",
    height: 50,
    marginBottom: 14,
    fontSize: 25,
  },
  appButtonTextSignUp: {
    fontSize: 14,
    color: "black",
    alignSelf: "center",
  },
  bottom: {
    backgroundColor: "white",
    elevation: 0,
  },
});
