import React, { Component, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import { Picker } from "@react-native-picker/picker";
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
import {
  Appbar,
  Button,
  TextInput,
  IconButton,
  Snackbar,
  DataTable,
} from "react-native-paper";
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

const AddComment = ({ route, navigation }) => {
  const { gradeParam, name, profile, userId} = route.params;
  const [comment, setComment] = useState("");
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(
    "Please provide comment!"
  );
  const [snackbarColor, setSnackbarColor] = useState("red");
  const [teacher, setTeacher] = useState([]);
  const [buttonIsLoading, setButtonIsLoading] = useState(false)

  const onDismissSnackBar = () => setSnackbar(false);

  useEffect(() => {
    var docRef = db.collection("teachers").doc(gradeParam.teacherId);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setTeacher(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);

  const addComment = (item) => {
    setButtonIsLoading(true)
    if (comment === "") {
      setSnackbarMessage("Please provide comment!");
      setSnackbarColor("red");
      setSnackbar(true);
    } else {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;
      db.collection("comments")
        .add({
          userId: userId,
          name: name,
          profile: profile,
          lrn: item.lrn,
          level: item.level,
          sy: item.sy,
          stageType: item.stageType,
          subject: item.subject,
          teacherId: item.teacherId,
          grade: Number(item.grade),
          grading: item.grading,
          solved: false,
          message: comment,
          deleted: false,
          createdAt: timestamp(),
        })
        .then(async function (docRef) {
          setSnackbarMessage("Comment posted successful!");
          setSnackbarColor("green");
          setSnackbar(true);
          setComment("");
          setButtonIsLoading(false)
        });

        sendPushNotif(item)
    }
  };

  const sendPushNotif = async (item) => {
    var date = new Date();
    var miliseconds = date.getTime();
    sendPushNotification({
      userId: userId,
      name: name,
      profile: profile,
      lrn: item.lrn,
      level: item.level,
      sy: item.sy,
      stageType: item.stageType,
      subject: item.subject,
      teacherId: item.teacherId,
      grade: Number(item.grade),
      grading: item.grading,
      solved: false,
      message: comment,
      deleted: false,
      createdAt: miliseconds,
    }, teacher.token)

    const admins = await db.collection("users").where("type", "==", "Admin").get()
    admins.docs.map(user => sendPushNotification({
      userId: userId,
      name: name,
      profile: profile,
      lrn: item.lrn,
      level: item.level,
      sy: item.sy,
      stageType: item.stageType,
      subject: item.subject,
      teacherId: item.teacherId,
      grade: Number(item.grade),
      grading: item.grading,
      solved: false,
      message: comment,
      deleted: false,
      createdAt: miliseconds,
    }, user.data().token))
  }


  async function sendPushNotification(comment, userToken) {
    console.log(comment, userToken)
    var date = new Date();
    var seconds = date.getTime() / 1000;
    var curHr = date.getHours()
    var great = ""

    if (curHr < 12) {
      great = "Good morning!"
    } else if (curHr < 18) {
      great = "Good afternoon!"
    } else {
      great = "Good evening!"
    }
    const message = {
      to: userToken,
      sound: 'default',
      title: `${comment.name} commented his/her grade in ${comment.subject}`,
      body: `${comment.message}`,
      badge: 1,
      data: {comment},
    };


    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <ScrollView style={{ backgroundColor: "white", flex: 1, marginTop: Constants.statusBarHeight }}>
        <View style={{ backgroundColor: "white" }}>
          <View style={{ backgroundColor: "white" }}>
            <IconButton
              icon="arrow-left"
              color="gray"
              size={30}
              onPress={() => navigation.goBack(null)}
              style={{ marginTop: 10 }}
            />
          </View>
          <View style={{ padding: 20, marginTop: -10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {gradeParam.level}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                School Year: {gradeParam.sy}
              </Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {teacher.position !== undefined
                ? `${teacher.position}: ${teacher.fname} ${teacher.lname}`
                : "Teacher"}
            </Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Subject</DataTable.Title>
                <DataTable.Title numeric>Grades</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row>
                <DataTable.Cell>{gradeParam.subject}</DataTable.Cell>
                <DataTable.Cell numeric>{gradeParam.grade}</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
            <TextInput
              style={{ marginTop: 20 }}
              dense
              numberOfLines={6}
              multiline={true}
              value={comment}
              mode="flat"
              label="Say Something."
              onChangeText={(grade) => setComment(grade)}
            />
            <Button
              icon="send"
              mode="contained"
              contentStyle={{ height: 55 }}
              color="#188ad6"
              style={{ marginTop: 10, borderRadius: 25 }}
              onPress={() => addComment(gradeParam)}
              loading={buttonIsLoading}
            >
              Post Comment
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
      </ScrollView>
    </>
  );
};

export default AddComment;

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
