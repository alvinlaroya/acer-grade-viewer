import React, { Component, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import {Picker} from '@react-native-picker/picker';
import moment from "moment";
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
  Avatar,
  Button,
  TextInput,
  IconButton,
  Snackbar,
  DataTable,
} from "react-native-paper";

/* var background = require('./assets/citybackground.jpg'); */
import { fb } from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const db = fb.firestore();

const ViewComment = ({ route, navigation }) => {
  const { gradeParam } = route.params;
  const [teacher, setTeacher] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState([]);

  useEffect(() => {
    var docRef = db.collection("teachers").doc(gradeParam.teacherId);

    docRef.get().then((doc) => {
        if (doc.exists) {
            setTeacher(doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }, [])

  useEffect(() => {
    var docRef = db.collection("users").doc(gradeParam.userId);

    docRef.get().then((doc) => {
        if (doc.exists) {
            setCommentAuthor(doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }, [])



  return teacher.position !== undefined ? (
    <ScrollView style={{backgroundColor: 'white', flex: 1, marginTop: Constants.statusBarHeight}}>
      <StatusBar style="light" backgroundColor="black" />
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
        <View style={{padding: 20, marginTop: -10}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>{gradeParam.level}</Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>School Year: {gradeParam.sy}</Text>
            </View>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>LRN: {gradeParam.lrn}</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{teacher.position !== undefined ? `${teacher.position}: ${teacher.fname} ${teacher.lname}` : "Teacher"}</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Subject</DataTable.Title>
                <DataTable.Title numeric>Grades</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row>
            <DataTable.Cell>{gradeParam.subject}</DataTable.Cell>
                <DataTable.Cell numeric>
                    {gradeParam.grade}
                </DataTable.Cell>
            </DataTable.Row>
            </DataTable>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 40, marginBottom: 10}}>Comment:</Text>
            <Text>{gradeParam.message}</Text>
            <View style={{marginTop: 60}}>
                <Text style={{fontSize: 10, marginBottom: 5}}>{moment.unix(gradeParam.createdAt.seconds).format("DD MMM YYYY hh:ss A")}</Text>
                <Text>From:</Text>
                <Avatar.Image
                size={40}
                source={{ uri: commentAuthor.profile !== '' ? commentAuthor.profile : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU' }}
                style={{ marginTop: 10 }}
                />
                <View style={{marginTop: -40, marginLeft: 50}}>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>{`${commentAuthor.fname} ${commentAuthor.lname}`}</Text>
                    <Text>{commentAuthor.email}</Text>
                </View>
            </View>
            {/* <Button icon="reply" mode="outlined" 
              contentStyle={{height: 40}}
              labelStyle={{color: 'gray'}}
              style={{width: 100, alignSelf: 'flex-end'}}
              onPress={() => console.log('Pressed')}
            >
              Reply
            </Button> */}
        </View>
      </View>
    </ScrollView>
  ) : (
      <View style={styles.container}>
          <Text>Please Wait...</Text>
      </View>
  );
};

export default ViewComment;

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
