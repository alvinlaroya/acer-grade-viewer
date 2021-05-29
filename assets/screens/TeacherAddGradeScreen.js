import React, { Component, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
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
import {
  Appbar,
  Button,
  TextInput,
  IconButton,
  Snackbar,
} from "react-native-paper";
/* import "firebase/auth"; */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Constants from 'expo-constants';

/* var background = require('./assets/citybackground.jpg'); */
var logo = require("../icon.png");
import firebase from "firebase/app";
import { fb } from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const db = fb.firestore();

const TeacherAddGradeScreen = ({ route, navigation }) => {
  const { sy, level, subjectId, subject, teacherId} = route.params;
  const [snackbarMessage, setSnackbarMessage] = useState('Empty Subject. Please Enter Subject!');
  const [snackbarColor, setSnackbarColor] = useState("red");
  const [lrn, setLrn] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false)
  const [studentInfo, setStudentInfo] = useState({
    id: '',
    token: '',
    fname: 'No',
    lname: 'Student',
  });
  const [grade, setGrade] = useState(0);
  const [grading, setGrading] = useState("");
  const [allGrades, setAllGrades] = useState([]);

  const [gradings, setGradings] = useState([
    [
        {id: 1, name: '1st Grading', value: '1st'},
        {id: 2, name: '2nd Grading', value: '2nd'},
        {id: 3, name: '3rd Grading', value: '3rd'},
        {id: 4, name: '4th Grading', value: '4th'},
    ],
    [
        {id: 5, name: '1st Quarter', value: '1st'},
        {id: 6, name: '2nd Quarter', value: '2nd'},
        {id: 7, name: '3rd Quarter', value: '3rd'},
        {id: 8, name: '4th Quarter', value: '4th'},
    ]
  ]);
  const [snackbarError, setSnackbarError] = useState(false);

  useEffect(() => {
    db.collection("students").where("lrn", "==", lrn)
    .get()
    .then((querySnapshot) => {
        querySnapshot.length > 0 && console.log("No such document")
        querySnapshot.forEach((doc) => {
            if(doc.exists) {
              setStudentInfo({
                id: doc.id,
                token: doc.data().token,
                fname: doc.data().fname,
                lname: doc.data().lname,
              })
              console.log("Has document")
            }
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }, [lrn])


  const sendGrade = () => {
    var thisLevel = false
    if(level === "Grade11" || level === "Grade12") {
        thisLevel = true
    }
    const timestamp = firebase.firestore.FieldValue.serverTimestamp;
    if (subject === "") {
      setSnackbarError(true);
      setSnackbarMessage("Empty Subject. Please Enter Subject!")
      setSnackbarColor("red");
    } else if (grade === 0) {
      setSnackbarError(true);
      setSnackbarMessage("Empty Grade. Please Enter Valid Number!")
      setSnackbarColor("red");
    } else if(grading === "") {
      setSnackbarError(true);
      setSnackbarMessage("Empty Grading. Please Select One Grading Period!")
      setSnackbarColor("red")
    } else {
      db.collection("grades")
        .add({
          lrn: lrn,
          studentName: `${studentInfo.fname} ${studentInfo.lname}`,
          level: level,
          sy: sy,
          stageType: thisLevel ? "sr" : "jr",
          subject: subject,
          teacherId: teacherId,
          grade: Number(grade),
          grading: grading,
          createdAt: timestamp(),
        })
        .then(function (docRef) {
            var date = new Date();
            var seconds = date.getTime() / 1000;

            setSnackbarError(true);
            setSnackbarMessage("Saved Grade Successfuly!")
            setSnackbarColor("green");
            setGrade(0);
            setAllGrades(oldArray => [...oldArray, {
              lrn: lrn,
              level: level,
              sy: sy,
              stageType: thisLevel ? "sr" : "jr",
              subject: subject,
              teacherId: teacherId,
              grade: Number(grade),
              grading: grading,
              createdAt: seconds,
            }]);
            /* sendNotificationToAllUsers(docRef.id, studentId) */
        });
    }

    setButtonLoading(true)
    sendNotificationToAllUsers(allGrades, studentInfo.token)
    var studentRef = db.collection("students").doc(studentInfo.id)
    studentRef.update({
        subjectsEnrolled: firebase.firestore.FieldValue.arrayUnion(subject)
      });
  }

  async function sendNotificationToAllUsers(grades, token) {
    sendPushNotification(grades, token)
  }

  async function sendPushNotification(grades, userToken) {
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
      title: `Grade Summary`,
      body: `Hello! ${great}, You have received your grade summary today. Check your sfis mobile grade viewer app now!`,
      badge: 1,
      data: {grades},
    };


    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    setSnackbarError(true);
    setSnackbarMessage("Grade Posted Successfuly!")
    setSnackbarColor("green");
    setButtonLoading(false)
  };

  const onDismissSnackBar = () => setSnackbarError(false);

  return (
    <View style={{backgroundColor: 'white', flex: 1, marginTop: Constants.statusBarHeight}}>
      <View style={{ backgroundColor: "white" }}>
      <View style={{backgroundColor: 'white'}}>
        <IconButton
          icon="arrow-left"
          color="gray"
          size={30}
          onPress={() => navigation.goBack(null)}
          style={{ marginTop: 10 }}
        />
      </View>
        <View style={{padding: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>Grade: {level}</Text>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>School Year: {sy}</Text>
            </View>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 5}}>Student Name: {`${studentInfo.fname} ${studentInfo.lname}`}</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>Subject: {subject}</Text>
            <TextInput
                mode="outlined"
                label="Student LRN"
                maxLength={12}
                keyboardType='numeric'
                onChangeText={(lrn) => setLrn(lrn)}
            />
            <Picker
                selectedValue={grading}
                style={{ height: 50, width: '100%', marginTop: 20}}
                onValueChange={(itemValue, itemIndex) => setGrading(itemValue)}>
                    <Picker.Item label="Select Grading/Quarter" value="Select Grading" enabled={false} />
                    {level === "Grade11" || level === "Grade12" ? (
                        gradings[1].map(type => (
                            <Picker.Item label={type.name} value={type.value} key={type.id}/>
                        ))
                    ) : (
                        gradings[0].map(type => (
                            <Picker.Item label={type.name} value={type.value} key={type.id}/>
                        ))
                    )}
            </Picker>
            <TextInput
                mode="outlined"
                label="Student Grade"
                onChangeText={(grade) => setGrade(grade)}
                keyboardType='numeric'
            />
            <Button
                content-save-outline
                mode="contained"
                loading={buttonLoading == true ? true : false} 
                contentStyle={{ height: 55 }}
                color="#05a148"
                style={{ marginTop: 10, borderRadius: 25 }}
                onPress={sendGrade}
            >
                Save Grade
            </Button>
        </View>
      </View>
      <Snackbar
        visible={snackbarError}
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
    </View>
  );
};

export default TeacherAddGradeScreen;

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
