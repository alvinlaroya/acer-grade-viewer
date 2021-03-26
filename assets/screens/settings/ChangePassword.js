import React, { Component } from "react";
import { Alert, View, ScrollView, StyleSheet, Text } from "react-native";
import { ImageBackground, Image } from "react-native";
import {
  Button,
  IconButton,
  TextInput,
  Snackbar
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import firebase from "firebase/app";
import { fb } from "../../../firebase";
import "firebase/auth";
import 'firebase/firestore';
import "firebase/storage";

import { useEffect, useState} from "react";

const db = fb.firestore();


const ChangePassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState("red");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const onDismissSnackBar = () => setSnackbar(false);

  /* var user = firebaseApp.auth().currentUser;
    var credential = firebase.auth.EmailAuthProvider.credential(
    firebase.auth().currentUser.email,
    providedPassword
    );

    // Prompt the user to re-provide their sign-in credentials

    user.reauthenticateWithCredential(credential).then(function() {
    // User re-authenticated.
    }).catch(function(error) {
    // An error happened.
    }); */

  const sendPasswordReset = () => {
    if(email === "") {
        setSnackbar(true);
        setSnackbarMessage("Please enter a valid email");
    } else {
        var auth = firebase.auth();
        auth.sendPasswordResetEmail(email).then(function() {
            setSnackbar(true);
            setSnackbarColor("green");
            setSnackbarMessage("Email password reset sent!")
        }).catch(function(error) {
            setSnackbar(true);
            setSnackbarColor("red");
            setSnackbarMessage(`${email} not exist. Please enter a valid email`);
        });
    }
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <IconButton
        icon="arrow-left"
        color="gray"
        size={30}
        onPress={() => navigation.goBack(null)}
        style={{ marginTop: Constants.statusBarHeight + 10 }}
      />
      <View
        style={{
          ...styles.container,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ height: 120, width: "90%" }}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Button icon="check" mode="contained" 
            style={{marginTop: 5}}
            color="#05a148"
            contentStyle={{height: 50}}
            onPress={sendPasswordReset}
          >
            Send Password Reset Email
          </Button>
        </View>
      </View>
      <Snackbar
        visible={snackbar}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: snackbarColor }}
        action={{
          label: "Close",
          onPress: () => {
            // Do something
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
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
  SectionStyle: {
    elevation: 2,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  iconInput: {
    padding: 10,
  },
  appButtonContainer: {
    elevation: 4,
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
});
