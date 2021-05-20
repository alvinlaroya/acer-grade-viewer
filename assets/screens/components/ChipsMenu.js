import React, { Component, useState, useEffect} from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { ImageBackground, Image } from "react-native";
import { Appbar, Avatar, Chip, Badge } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { fb } from "../../../firebase";
import firebase from "firebase/app";
const db = fb.firestore();

const ChipsMenu = (props) => {
  const navigation = useNavigation();
  const [teachersReq, setTeachersReq] = useState(0)
  const [studentReq, setStudentReq] = useState(0)
  const [adminReq, setAdminReq] = useState(0)

  useEffect(() => {
    db.collection("users")
      .where("accepted", "==", false)
      .where("type", "==", "Admin")
      .onSnapshot((querySnapshot) => {
        const adminsArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        setAdminReq(adminsArr.length)
      });
  }, [])

  useEffect(() => {
    db.collection("users")
      .where("accepted", "==", false)
      .where("type", "==", "Teacher")
      .onSnapshot((querySnapshot) => {
        const teachersArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        setTeachersReq(teachersArr.length)
      });
  }, [])

  useEffect(() => {
    db.collection("users")
      .where("accepted", "==", false)
      .where("type", "==", "Student")
      .onSnapshot((querySnapshot) => {
        const studentsArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        setStudentReq(studentsArr.length)
      });
  }, [])
  return (
    <>
      <Chip
        avatar={<Avatar.Image size={25} source={{ uri: props.profile !== '' ? props.profile : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU' }} />}
        onPress={() => navigation.navigate("Profile")}
        style={{ marginRight: 15, height: 35, marginLeft: 20 }}
      >
        Profile
      </Chip>
      {
        props.type === "Admin" && (
          <>
            <View>
              <Chip
                icon="account-check"
                onPress={() => navigation.navigate("TeachersRequests")}
                style={{ marginRight:15, height: 35 }}
              >
                Teacher's Request
              </Chip>
              {teachersReq > 0 && (<Badge style={{marginTop: -34, marginRight: 10}} size={15}>{teachersReq}</Badge>)}
            </View>
            <View>
              <Chip
                icon="human-child"
                onPress={() => navigation.navigate("StudentsRequests")}
                style={{ marginRight:15, height: 35 }}
              >
                Student's Request
              </Chip>
              {studentReq > 0 && (<Badge style={{marginTop: -34, marginRight: 10}} size={15}>{studentReq}</Badge>)}
            </View>
            <View>
              <Chip
                icon="school"
                onPress={() => navigation.navigate("EnrolledStudents")}
                style={{ marginRight:15, height: 35 }}
              >
                Enrolled Students
              </Chip>
            </View>
            <View>
              <Chip
                icon="shield-account"
                onPress={() => navigation.navigate("AdminRequests")}
                style={{ marginRight:15, height: 35 }}
              >
                Admin's Request
              </Chip>
              {adminReq > 0 && (<Badge style={{marginTop: -34, marginRight: 10}} size={15}>{adminReq}</Badge>)}
            </View>
            <Chip
              icon="human-child"
              onPress={() => navigation.navigate("SignupStudentScreen")}
              style={{ marginRight:15, height: 35 }}
            >
              Register Student
            </Chip>
            <Chip
              icon="account-key"
              onPress={() => navigation.navigate("AppToken")}
              style={{ marginRight:15, height: 35 }}
            >
              App Token
            </Chip>
          </>
        )
      }
      <Chip
        icon="cog"
        onPress={() => alert("AAWF")}
        style={{ marginRight: 27, height: 35 }}
        onPress={() => navigation.navigate("Settings", {
          name: `${props.name}`,
          profile: props.profile,
          address: props.address,
          id: props.id,
          contact: props.contact,
          email: props.email
        })}
      >
        Settings
      </Chip>
    </>
  );
};

export default ChipsMenu;
