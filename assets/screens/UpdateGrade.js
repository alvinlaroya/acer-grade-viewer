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

/* var background = require('./assets/citybackground.jpg'); */
var logo = require("../icon.png");
import firebase from "firebase/app";
import { fb } from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const db = fb.firestore();

const UpdateGrade = ({ route, navigation }) => {
  const { gradeParam } = route.params;
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [grade, setGrade] = useState(0);
  const [subject, setSubject] = useState(gradeParam.subject);
  const [subjects, setSubjects] = useState([]);

  const onDismissSnackBar = () => setSnackbar(false);

  useEffect(() => {
    const unsubscribe = db.collection("subjects")
        .where("type", "==", gradeParam.stageType)
        .onSnapshot((querySnapshot) => {
          const subjectsArr = querySnapshot.docs.map((documentSnapshot) => {
            return {
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            };
          });
    
          setSubjects(subjectsArr);
        });
        return () => unsubscribe();
  }, [])

  const updateGrade = (item) => {
      db.collection("grades").doc(item.id).update({
          grade: Number(grade),
          subject: subject
      }).then(() => {
        setSnackbar(true);
        setSnackbarMessage("Grade Updated Successfuly!")
      })
  }

  const deleteGrade = (item) => {
    Alert.alert(
      "Delete Grade",
      "Are you sure you want to delete?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          db.collection("grades").doc(item.id).delete().then(() => {
            setSnackbar(true);
            setSnackbarMessage("Grade Deleted Successfuly!")
          })
        }}
      ]
    );
}

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
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
            <Text style={{fontSize: 18, marginBottom: 20}}><Text style={{fontWeight: 'bold'}}>GRADE:</Text> {gradeParam.grade}</Text>
            <TextInput
                mode="outlined"
                label="Enter New Grade"
                onChangeText={(grade) => setGrade(grade)}
                keyboardType='numeric'
            />
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 25, marginBottom: -25}}>Subject:</Text>
            <Picker
                selectedValue={subject}
                style={{ height: 50, width: '100%', marginTop: 20}}
                onValueChange={(itemValue, itemIndex) => setSubject(itemValue)}>
                    <Picker.Item label="Select Subject" value="Select Subject" />
                    {subjects.map((subject, index) => (
                        <Picker.Item key={index} label={subject.name} value={subject.name} />
                    ))}
            </Picker>
            <Button
                icon="delete-outline"
                mode="contained"
                contentStyle={{ height: 55 }}
                color="red"
                style={{ marginTop: 10, borderRadius: 25 }}
                onPress={() => deleteGrade(gradeParam)}
            >
                Delete this Grade
            </Button>
            <Button
                icon="content-save-outline"
                mode="contained"
                contentStyle={{ height: 55 }}
                color="#05a148"
                style={{ marginTop: 10, borderRadius: 25 }}
                onPress={() => updateGrade(gradeParam)}
            >
                Save Changes
            </Button>
        </View>
      </View>
      <Snackbar
        visible={snackbar}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: 'green'}}
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

export default UpdateGrade;

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
