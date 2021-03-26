import React, { Component } from "react";
import { Alert, View, ScrollView, StyleSheet, Text } from "react-native";
import { ImageBackground, Image } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  IconButton,
  TextInput,
  Snackbar,
  List
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import firebase from "firebase/app";
import { fb } from "../../firebase";
import "firebase/auth";
import 'firebase/firestore';
import "firebase/storage";

import ChipsMenu from "../screens/components/ChipsMenu";
import CardListButton from "../screens/components/CardListButton";
import { useEffect, useState} from "react";

const db = fb.firestore();


const Settings = ({ route, navigation }) => {
  const {
    name,
    profile,
    address,
    id,
    contact,
    email
  } = route.params

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="black" />
      <Appbar.Header style={{ marginTop: 1, backgroundColor: "white", marginTop: Constants.statusBarHeight }}>
        <Appbar.BackAction onPress={() => navigation.goBack()}/>
        <Appbar.Content
          title="Settings"
          subtitle="Setting and configurations"
        />
      </Appbar.Header>
      <List.Item
        onPress={() => navigation.navigate("Profile")}
        title={name}
        description={email}
        left={props => 
          <Avatar.Image
          {...props}
          size={30}
          source={{ uri: profile }}
          style={{ marginTop: 8, marginLeft: 15, marginRight: 10}}
        />
      }
      />
      <List.Item
        onPress={() => navigation.navigate("ChangePassword")}
        title="Change Password"
        description="Change your current password"
        left={props => <List.Icon {...props} icon="lock" style={{marginLeft: 10}}/>}
      />
      <List.Item
        onPress={() => navigation.navigate("SchoolInformation")}
        title="About School"
        description="Information about the school"
        left={props => <List.Icon {...props} icon="school" style={{marginLeft: 10}}/>}
      />
    </View>
  );
};

export default Settings;

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
