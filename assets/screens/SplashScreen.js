import React, { Component, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableHighlight,
  Text,
  Animated,
} from "react-native";
import { ImageBackground, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, TextInput } from "react-native-paper";

import { fb } from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const db = fb.firestore();
const logo = require('../acelogo.png')

function SplashScreen({ navigation }) {
  const [appToken, setAppToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [token, setToken] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [hasSession, setHasSession] = useState(true);

  useEffect(() => {
    fetchAppToken();
  }, [token]);

   useEffect(() => {
    NavigationAuthToHome();
  }, []);

  const fetchAppToken = () => {
    var tokenRef = db.collection("app_token").doc("sfis");
    tokenRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setAppToken(doc.data().token);
        } else {
          // doc.data() will be undefined in this case
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const clickAdmin = () => {
    if (appToken === token) {
      setModalVisible(false);
      navigation.navigate("SignUpScreen", {
        enterAs: "Admin",
      });
    } else {
      Alert.alert(
        "Sorry, you've entered an invalid token. Please contact the main administrator"
      );
    }
  };

  const NavigationAuthToHome = () => {
    var loggedIn = false
    fb.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("We Are Authenticated!!!!");
        var docRef = db.collection("users").doc(user.uid);
        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              if (doc.data().accepted === true) {
                if(loggedIn === false) {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "MainScreen",
                        params: {
                          userId: user.uid,
                          fname: doc.data().fname,
                          lname: doc.data().lname,
                          email: doc.data().email,
                          contact: doc.data().contact,
                          address: doc.data().address,
                          profile: doc.data().profile,
                          type: doc.data().type,
                        },
                      },
                    ],
                  });
                }
                loggedIn = true
              } else {
                if(loggedIn === false) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "NotAcceptedScreen" }],
                  });
                }
                loggedIn = true
              }
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function (error) {
            console.log("Error getting document:", error);
          });
      } else {
       setHasSession(false)
      }
    });
  };

  return !hasSession ? (
    <View style={styles.centeredView}>
      <StatusBar style="auto" />
      <View>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>I am</Text>
      </View>
      <View style={{ padding: 30, width: "100%"}}>
        <View style={{ width: "100%" }}>
          <Button
            icon="human-child"
            mode="outlined"
            color="#05a148"
            contentStyle={{ height: 50 }}
            style={{ width: "100%", justifyContent: "center" }}
            labelStyle={{ fontSize: 17 }}
            onPress={() => {
              navigation.navigate("SignUpScreen", {
                enterAs: "Student",
              });
            }}
          >
            Student
          </Button>
        </View>
        <View style={{ width: "100%", marginTop: 10 }}>
          <Button
            icon="briefcase-account"
            mode="outlined"
            color="#05a148"
            contentStyle={{ height: 50 }}
            style={{ width: "100%", justifyContent: "center" }}
            labelStyle={{ fontSize: 17 }}
            onPress={() => {
              navigation.navigate("SignUpScreen", {
                enterAs: "Teacher",
              });
            }}
          >
            Teacher
          </Button>
        </View>
        <View style={{ width: "100%", marginTop: 10}}>
          <Button
            icon="shield-account"
            mode="outlined"
            contentStyle={{ height: 50 }}
            color="#05a148"
            style={{ width: "100%", justifyContent: "center" }}
            labelStyle={{ fontSize: 17 }}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            Admin
          </Button>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: 20,
          position: "absolute",
          bottom: 10,
          lef: 0,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              color: "gray",
              textAlign: "center",
            }}
          >
            SFIS MOBILE GRADE VIEWER
          </Text>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ height: 50, width: 260, justifyContent: "center" }}>
              {appToken !== "" ? (
                <TextInput
                  label="Please enter token to access admin"
                  secureTextEntry={true}
                  onChangeText={(tokenInput) => setToken(tokenInput)}
                />
              ) : (
                <Text style={{ fontSize: 18, textAlign: "center" }}>
                  Please wait...
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "40%" }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#e3c102" }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>
              </View>
              <View style={{ width: "40%" }}>
                <TouchableHighlight
                  style={{
                    ...styles.openButton,
                    backgroundColor: "#05a148",
                    marginLeft: 5,
                  }}
                  onPress={clickAdmin}
                >
                  <Text style={styles.textStyle}>Proceed</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  ) : (
    <View style={styles.container}>
      <Image source={logo} style={{height: 90, width: 90}}></Image>
      <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 8, color: 'white'}}>SFIS Mobile Grade Viewer</Text>
    </View>
  )
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1991a1",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
