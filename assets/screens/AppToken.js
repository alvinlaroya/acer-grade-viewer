import React, { Component } from "react";
import { Alert, View, ScrollView, StyleSheet, Text } from "react-native";
import { ImageBackground, Image } from "react-native";
import {
  Button,
  IconButton,
  TextInput,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { fb } from "../../firebase";
import ChipsMenu from "../screens/components/ChipsMenu";
import CardListButton from "../screens/components/CardListButton";
import { useEffect, useState} from "react";

const db = fb.firestore();

const AppToken = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [defaultToken, setDefaultToken] = useState('');
  useEffect(() => {
    fetchAppToken();
  }, []);

  const fetchAppToken = () => {
    var tokenRef = db.collection("app_token").doc("acetoken");
    tokenRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setToken(doc.data().token);
          setDefaultToken(doc.data().defaultToken)
        } else {
          // doc.data() will be undefined in this case
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const setAppToken = () => {
    // To update age and favorite color:
    db.collection("app_token").doc("acetoken").update({
      "token": token,
      "favorites.color": "Red"
    })
    Alert.alert("App token set succesfuly!")
  }

  const setDefaultAppToken = () => {
    // To update age and favorite color:
    setToken(defaultToken)
    db.collection("app_token").doc("acetoken").update({
      "token": defaultToken,
      "favorites.color": "Red"
    })
    Alert.alert("App token set to default!.")
  }

  return (
    <>
      <IconButton
        icon="arrow-left"
        color="gray"
        size={30}
        onPress={() => navigation.goBack(null)}
        style={{ marginTop: 10 }}
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
            label="App Token"
            value={token}
            secureTextEntry={true}
            onChangeText={(text) => setToken(text)}
          />
          <Button icon="check" mode="contained" 
            style={{marginTop: 15}}
            color="#920696"
            contentStyle={{height: 50}}
            onPress={setDefaultAppToken}
          >
            Set to default token
          </Button>
          <Button icon="check" mode="contained" 
            style={{marginTop: 5}}
            color="#05a148"
            contentStyle={{height: 50}}
            onPress={setAppToken}
          >
            Set App Token
          </Button>
        </View>
      </View>
    </>
  );
};

export default AppToken;

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
