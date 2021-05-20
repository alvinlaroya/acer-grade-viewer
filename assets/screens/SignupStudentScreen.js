import React, { Component, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
/* import { firebase } from '../../firebase'; */
import { Appbar, Button, TextInput } from "react-native-paper";
/* import "firebase/auth"; */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

/* var background = require('./assets/citybackground.jpg'); */
import firebase from "firebase/app";
import { fb } from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const db = fb.firestore();

const SignupStudentScreen = ({ navigation }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mname, setMname] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [lrn, setLrn] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianFname, setGuardianFname] = useState("");
  const [guardianLname, setGuardianLname] = useState("");
  const [guardianMname, setGuardianMname] = useState("");
  const [guardianAddress, setGuardianAddress] = useState("");
  const [guardianContact, setGuardianContact] = useState("");

  const [image, setImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const signupUser = async (
    lrnVal,
    fnameVal,
    mnameVal,
    lnameVal,
    addressVal,
    emailVal,
    contactVal,
    passwordVal
  ) => {
    setIsSigningUp(true);
    try {
      if (password.length < 6) {
        alert("Please enter at least 6 character!");
        return;
      } else {
        fb.auth()
          .createUserWithEmailAndPassword(emailVal, passwordVal)
          .then(async (cred) => {
            let userRef = db.collection("users").doc(cred.user.uid);
            let studentRef = db.collection("students").doc(cred.user.uid);

            const timestamp = firebase.firestore.FieldValue.serverTimestamp;

            userRef
              .set({
                userId: cred.user.uid,
                fname: fnameVal,
                mname: mnameVal,
                lname: lnameVal,
                address: addressVal,
                profile: profileImage,
                email: emailVal,
                contact: contactVal,
                accepted: true,
                type: "Student",
                requestStatus: 1,
                createdAt: timestamp(),
              })
              .then(() => {
                fb.auth()
                  .signOut()
                  .then(() => {
                    // Sign-out successful.
                  })
                  .catch((error) => {
                    // An error happened.
                  });
              });

            studentRef.set({
              userId: cred.user.uid,
              lrn: lrnVal,
              fname: fnameVal,
              lname: lnameVal,
              address: addressVal,
              profile: profileImage,
              email: emailVal,
              contact: contactVal,
              createdAt: timestamp(),
            });

            if (guardianEmail !== "") {
              fb.auth()
                .createUserWithEmailAndPassword(
                  guardianEmail,
                  "aceguardianpassword"
                )
                .then(async (guardianCred) => {
                  let guardianUserRef = db
                    .collection("users")
                    .doc(guardianCred.user.uid);
                  guardianUserRef.set({
                    userId: guardianCred.user.uid,
                    fname: guardianFname,
                    lname: guardianLname,
                    email: guardianEmail,
                    address: guardianAddress,
                    profile: "",
                    email: guardianEmail,
                    contact: guardianContact,
                    accepted: true,
                    type: "Guardian",
                    requestStatus: 1,
                    createdAt: timestamp(),
                  });

                  let guardianRef = db
                    .collection("guardians")
                    .doc(guardianCred.user.uid);
                  guardianRef
                    .set({
                      userId: guardianCred.user.uid,
                      fname: guardianFname,
                      lname: guardianLname,
                      email: guardianEmail,
                      address: guardianAddress,
                      profile: "",
                      email: guardianEmail,
                      contact: guardianContact,
                      childId: cred.user.uid,
                      childLrn: lrnVal,
                      createdAt: timestamp(),
                    })
                    .then(() => {
                      fb.auth()
                        .signOut()
                        .then(() => {
                          // Sign-out successful.
                        })
                        .catch((error) => {
                          // An error happened.
                        });
                    });
                });
            }

            if (cred.user) {
              cred.user
                .updateProfile({
                  displayName: `${fname} ${lname}`,
                  photoURL: profileImage,
                })
                .then((s) => {
                  console.log(s);
                  setIsSigningUp(false);
                });

                setImage("");
            }
          })
          .catch(function (error) {
            // Handle Errors here.
            var errorMessage = error.message;
            Alert.alert(
              "MOBAlert",
              `${errorMessage}`,
              [
                {
                  text: "Close",
                  onPress: () => console.log("Close Pressed"),
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
            // ...
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = fb
      .storage()
      .ref()
      .child("profileImages/" + imageName);

    ref.put(blob).on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error.message);
      },
      () => {
        ref.getDownloadURL().then((url) => {
          //from url you can fetched the uploaded image easily
          setProfileImage(url);
        });
      }
    );
  };

  const pickImage = async () => {
    /* let result = await ImagePicker.launchCameraAsync(); */ // THIS IS FOR TRIGGERING CAMERA
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      var date = Math.round(new Date().getTime() / 1000);
      uploadImage(result.uri, `aceProfileImage${date}`)
        .then(() => {
          //
        })
        .catch((error) => {
          alert(error);
        });

      setImage(result.uri);
    }
  };

  return isSigningUp ? (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={{
          uri:
            "https://wpamelia.com/wp-content/uploads/2018/11/ezgif-2-6d0b072c3d3f.gif",
        }}
        style={{ width: "70%", height: 70 }}
      />
      <Text style={{ fontSize: 12, fontWeight: "bold", marginTop: -15 }}>
        Signing Up
      </Text>
    </View>
  ) : (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" barStyle="dark-content" />
      <Appbar style={styles.bottom}>
        <Appbar.Action
          icon="arrow-left"
          onPress={() => navigation.goBack(null)}
          color="black"
        />
      </Appbar>
      <View style={styles.formContainer}>
        <Text
          style={{
            fontSize: 11,
            marginBottom: 15,
            color: "black",
            textAlign: "center",
          }}
        >
          ACE ONLINE GRADE VIEWER MOBILE APPLICATION OF SAN FABIAN INTEGRATED
          SCHOOL SPED CENTER
        </Text>
        <View>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{
                uri:
                  image !== ""
                    ? image
                    : "https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png",
              }}
              style={styles.logoProfile}
            ></Image>
          </TouchableOpacity>
          <Text
            style={{ textAlign: "center", marginTop: -15, marginBottom: 15 }}
          >
            {image !== "" ? "Change Profile Picture" : "Select Profile Picture"}
          </Text>
        </View>
        <View style={{ width: "100%" }}>
          <TextInput
            dense={true}
            label="Email"
            onChangeText={(email) => setEmail(email)}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "100%" }}>
              <TextInput
                dense={true}
                style={{ marginTop: 10 }}
                label="Password"
                secureTextEntry={!passwordVisible}
                onChangeText={(password) => setPassword(password)}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{ position: "absolute", top: 12, right: 4 }}
              >
                <MaterialCommunityIcons
                  name={passwordVisible ? `eye-off-outline` : `eye-outline`}
                  color="black"
                  size={25}
                  style={styles.iconInput}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
              dense={true}
              style={{ marginTop: 10 }}
              label="LRN"
              maxLength={12}
              onChangeText={(lrn) => setLrn(lrn)}
            />
          <TextInput
            dense={true}
            style={{ marginTop: 10 }}
            label="First Name"
            onChangeText={(fname) => setFname(fname)}
          />
          <TextInput
            dense={true}
            style={{ marginTop: 10 }}
            label="Middle Name"
            onChangeText={(mname) => setMname(mname)}
          />
          <TextInput
            dense={true}
            style={{ marginTop: 10 }}
            label="Last Name"
            onChangeText={(lname) => setLname(lname)}
          />
          <TextInput
            dense={true}
            style={{ marginTop: 10 }}
            label="Address"
            onChangeText={(address) => setAddress(address)}
          />
          <TextInput
            dense={true}
            style={{ marginTop: 10 }}
            label="Contact"
            onChangeText={(contact) => setContact(contact)}
            maxLength={11}
            keyboardType="numeric"
          />
          <TextInput
                dense={true}
                style={{ marginTop: 10 }}
                label="Guardian First Name"
                onChangeText={(gFname) => setGuardianFname(gFname)}
              />
              <TextInput
                dense={true}
                style={{ marginTop: 10 }}
                label="Guardian Last Name"
                onChangeText={(gLname) => setGuardianLname(gLname)}
              />
              <TextInput
                dense={true}
                style={{ marginTop: 10 }}
                label="Guardian Middle Name"
                onChangeText={(gMname) => setGuardianMname(gMname)}
              />
              <TextInput
                dense={true}
                style={{ marginTop: 10 }}
                label="Guardian Email (Optional)"
                setGuardian
                onChangeText={(gEmail) => setGuardianEmail(gEmail)}
              />
              <TextInput
                dense={true}
                style={{ marginTop: 10 }}
                label="Guardian Address"
                onChangeText={(gAddress) => setGuardianAddress(gAddress)}
              />
              <TextInput
                dense={true}
                style={{ marginTop: 10 }}
                label="Guardian Contact"
                onChangeText={(gContact) => setGuardianContact(gContact)}
                maxLength={11}
                keyboardType="numeric"
              />
        </View>
        <Button
          contentStyle={{ height: 50 }}
          labelStyle={{ fontSize: 18 }}
          style={styles.appButtonContainer}
          loading={buttonLoading == true ? true : false}
          mode="contained"
          onPress={() =>
            signupUser(
              lrn,
              fname,
              mname,
              lname,
              address,
              email,
              contact,
              password
            )
          }
        >
          Register Student
        </Button>
      </View>
    </ScrollView>
  );
};

export default SignupStudentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
