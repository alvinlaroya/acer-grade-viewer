import React, { Component, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
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
  Avatar,
  Button,
  TextInput,
  IconButton,
  Snackbar,
  DataTable,
  ActivityIndicator,
  Colors,
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

const StudentMyGrades = ({ route, navigation }) => {
  const { id, level, sy, type, syId, stageName } = route.params;
  const name = firebase.auth().currentUser.displayName;
  const profile = firebase.auth().currentUser.photoURL;
  const [parentInfo, setParentInfo] = useState({});
  const [studentInfo, setStduentInfo] = useState({});
  const [average1st, setAverage1st] = useState([]);
  const [average2nd, setAverage2nd] = useState([]);
  const [average3rd, setAverage3rd] = useState([]);
  const [average4th, setAverage4th] = useState([]);
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [infoIsloading, setInfoIsLoading] = useState(true);

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessages] = useState(false);

  useEffect(() => {
    type === "Student" ? fetchAllWithStudent(id) : fetchAllWithGuadian();
  }, []);

  const fetchAllWithGuadian = () => {
    var docRef = db.collection("guardians").doc(id);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          fetchAllWithStudent(doc.data().childId);
          setParentInfo(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const fetchAllWithStudent = (childId) => {
    var docRef = db.collection("students").doc(childId);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setStduentInfo(doc.data());
          setInfoIsLoading(false);

          db.collection("grades")
            .where("level", "==", level)
            .where("sy", "==", sy)
            .where("lrn", "==", doc.data().lrn)
            .onSnapshot((querySnapshot) => {
              const gradesArr = querySnapshot.docs.map((documentSnapshot) => {
                return {
                  id: documentSnapshot.id,
                  ...documentSnapshot.data(),
                };
              });

              gradesArr.map(
                (grades) =>
                  grades.grading === "1st" &&
                  setAverage1st((oldArray) => [...oldArray, grades.grade])
              );
              gradesArr.map(
                (grades) =>
                  grades.grading === "2nd" &&
                  setAverage2nd((oldArray) => [...oldArray, grades.grade])
              );
              gradesArr.map(
                (grades) =>
                  grades.grading === "3rd" &&
                  setAverage3rd((oldArray) => [...oldArray, grades.grade])
              );
              gradesArr.map(
                (grades) =>
                  grades.grading === "4th" &&
                  setAverage4th((oldArray) => [...oldArray, grades.grade])
              );

              setGrades(gradesArr);
              setIsLoading(false);
            });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };

  const onDismissSnackBar = () => setSnackbar(false);

  const enroll = () => {
    let studentRef = db.collection('students').doc(id);
    Alert.alert(
      "Are you sure?",
      `You want to enroll to ${stageName} ?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          studentRef.update({
            enrolled_in: firebase.firestore.FieldValue.arrayUnion(`${syId}${stageName}`),
          });
          setSnackbarMessages(`You successfully enrolled in ${stageName}. SY: ${syId} - ${parseInt(syId) + 1}`)
          setSnackbar(true)
        }}
      ]
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <ScrollView style={{ backgroundColor: "white", marginTop: Constants.statusBarHeight }}>
        <View style={{ backgroundColor: "white" }}>
          <View style={{ backgroundColor: "white", justifyContent: 'space-between', flexDirection: 'row' }}>
            <IconButton
              icon="arrow-left"
              color="gray"
              size={30}
              onPress={() => navigation.goBack(null)}
              style={{ marginTop: 10 }}
            />
            <TouchableOpacity onPress={enroll}>
              <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 15, marginRight: 15}}>Enroll</Text>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 20, marginTop: -10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {type === "Student"
                    ? name
                    : `${parentInfo.fname} ${parentInfo.lname}`}
                </Text>
                <Text style={{ fontSize: 18 }}>
                  <Text style={{ fontWeight: "bold" }}>LRN:</Text>{" "}
                  {studentInfo.lrn}
                </Text>
              </View>
              <Avatar.Image
                size={60}
                source={{
                  uri:
                    type === "Student"
                      ? profile
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU",
                }}
                style={{ marginTop: -10 }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 18 }}>
                <Text style={{ fontWeight: "bold" }}>Grade:</Text> {level}
              </Text>
              <Text style={{ fontSize: 18 }}>
                <Text style={{ fontWeight: "bold" }}>School Year:</Text> {sy}
              </Text>
            </View>
          </View>
          <View style={{ padding: 20 }}>
            <View
              style={{
                backgroundColor: "#05a148",
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 15,
                  color: "white",
                }}
              >
                1st{" "}
                {level === "Grade11" || level === "Grade12"
                  ? "Quarter"
                  : "Grading"}
              </Text>
            </View>
            {isLoading && infoIsloading ? (
              <ActivityIndicator
                animating={true}
                color={Colors.red800}
                style={{ marginTop: 20 }}
              />
            ) : (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Subjects</DataTable.Title>
                  <DataTable.Title numeric>Grades</DataTable.Title>
                  <DataTable.Title numeric>Add Comment</DataTable.Title>
                </DataTable.Header>
                {grades.map((gradeLoop, index) =>
                  gradeLoop.grading === "1st" ? (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{gradeLoop.subject}</DataTable.Cell>
                      <DataTable.Cell numeric>{gradeLoop.grade}</DataTable.Cell>
                      <DataTable.Cell numeric>
                        <IconButton
                          icon="comment-outline"
                          color="gray"
                          size={30}
                          onPress={() =>
                            navigation.navigate("AddComment", {
                              gradeParam: gradeLoop,
                              name: type === "Student" ? `${studentInfo.fname} ${studentInfo.lname}` : `${parentInfo.fname} ${parentInfo.lname}`,
                              profile: type === "Student" ? `${studentInfo.profile}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU",
                              userId: id
                            })
                          }
                          style={{ marginTop: 10 }}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ) : (
                    <></>
                  )
                )}

                {average1st.length > 0 && (
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text style={{ fontWeight: "bold" }}>Average</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {(
                        average1st.reduce((a, b) => a + b, 0) / average1st.length
                      ).toFixed(2)}
                    </DataTable.Cell>
                    <DataTable.Cell numeric></DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable>
            )}
          </View>
          <View style={{ padding: 20 }}>
            <View
              style={{
                backgroundColor: "#05a148",
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 15,
                  color: "white",
                }}
              >
                2nd{" "}
                {level === "Grade11" || level === "Grade12"
                  ? "Quarter"
                  : "Grading"}
              </Text>
            </View>
            {isLoading ? (
              <ActivityIndicator
                animating={true}
                color={Colors.red800}
                style={{ marginTop: 20 }}
              />
            ) : (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Subjects</DataTable.Title>
                  <DataTable.Title numeric>Grades</DataTable.Title>
                  <DataTable.Title numeric>Add Comment</DataTable.Title>
                </DataTable.Header>
                {grades.map((gradeLoop, index) =>
                  gradeLoop.grading === "2nd" ? (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{gradeLoop.subject}</DataTable.Cell>
                      <DataTable.Cell numeric>{gradeLoop.grade}</DataTable.Cell>
                      <DataTable.Cell numeric>
                        <IconButton
                          icon={
                            type === "Admin"
                              ? "dots-vertical"
                              : "comment-outline"
                          }
                          color="gray"
                          size={30}
                          onPress={() =>
                            navigation.navigate("AddComment", {
                              gradeParam: gradeLoop,
                              name: type === "Student" ? `${studentInfo.fname} ${studentInfo.lname}` : `${parentInfo.fname} ${parentInfo.lname}`,
                              profile: type === "Student" ? `${studentInfo.profile}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU",
                              userId: id
                            })
                          }
                          style={{ marginTop: 10 }}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ) : (
                    <></>
                  )
                )}

                {average2nd.length > 0 && (
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text style={{ fontWeight: "bold" }}>Average</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {(
                        average2nd.reduce((a, b) => a + b, 0) / average2nd.length
                      ).toFixed(2)}
                    </DataTable.Cell>
                    <DataTable.Cell numeric></DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable>
            )}
          </View>
          <View style={{ padding: 20 }}>
            <View
              style={{
                backgroundColor: "#05a148",
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 15,
                  color: "white",
                }}
              >
                3rd{" "}
                {level === "Grade11" || level === "Grade12"
                  ? "Quarter"
                  : "Grading"}
              </Text>
            </View>
            {isLoading ? (
              <ActivityIndicator
                animating={true}
                color={Colors.red800}
                style={{ marginTop: 20 }}
              />
            ) : (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Subjects</DataTable.Title>
                  <DataTable.Title numeric>Grades</DataTable.Title>
                  <DataTable.Title numeric>Add Comment</DataTable.Title>
                </DataTable.Header>
                {grades.map((gradeLoop, index) =>
                  gradeLoop.grading === "3rd" ? (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{gradeLoop.subject}</DataTable.Cell>
                      <DataTable.Cell numeric>{gradeLoop.grade}</DataTable.Cell>
                      <DataTable.Cell numeric>
                        <IconButton
                          icon={
                            type === "Admin"
                              ? "dots-vertical"
                              : "comment-outline"
                          }
                          color="gray"
                          size={30}
                          onPress={() =>
                            navigation.navigate("AddComment", {
                              gradeParam: gradeLoop,
                              name: type === "Student" ? `${studentInfo.fname} ${studentInfo.lname}` : `${parentInfo.fname} ${parentInfo.lname}`,
                              profile: type === "Student" ? `${studentInfo.profile}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU",
                              userId: id
                            })
                          }
                          style={{ marginTop: 10 }}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ) : (
                    <></>
                  )
                )}

                {average3rd.length > 0 && (
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text style={{ fontWeight: "bold" }}>Average</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {(
                        average3rd.reduce((a, b) => a + b, 0) / average3rd.length
                      ).toFixed(2)}
                    </DataTable.Cell>
                    <DataTable.Cell numeric></DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable>
            )}
          </View>
          <View style={{ padding: 20 }}>
            <View
              style={{
                backgroundColor: "#05a148",
                height: 50,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 15,
                  color: "white",
                }}
              >
                4th{" "}
                {level === "Grade11" || level === "Grade12"
                  ? "Quarter"
                  : "Grading"}
              </Text>
            </View>
            {isLoading ? (
              <ActivityIndicator
                animating={true}
                color={Colors.red800}
                style={{ marginTop: 20 }}
              />
            ) : (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Subjects</DataTable.Title>
                  <DataTable.Title numeric>Grades</DataTable.Title>
                  <DataTable.Title numeric>Add Comment</DataTable.Title>
                </DataTable.Header>
                {grades.map((gradeLoop, index) =>
                  gradeLoop.grading === "4th" ? (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{gradeLoop.subject}</DataTable.Cell>
                      <DataTable.Cell numeric>{gradeLoop.grade}</DataTable.Cell>
                      <DataTable.Cell numeric>
                        <IconButton
                          icon={
                            type === "Admin"
                              ? "dots-vertical"
                              : "comment-outline"
                          }
                          color="gray"
                          size={30}
                          onPress={() =>
                            navigation.navigate("AddComment", {
                              gradeParam: gradeLoop,
                              name: type === "Student" ? `${studentInfo.fname} ${studentInfo.lname}` : `${parentInfo.fname} ${parentInfo.lname}`,
                              profile: type === "Student" ? `${studentInfo.profile}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU",
                              userId: id
                            })
                          }
                          style={{ marginTop: 10 }}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ) : (
                    <></>
                  )
                )}

                {average4th.length > 0 && (
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text style={{ fontWeight: "bold" }}>Average</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {(
                        average4th.reduce((a, b) => a + b, 0) / average4th.length
                      ).toFixed(2)}
                    </DataTable.Cell>
                    <DataTable.Cell numeric></DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable>
            )}
          </View>
        </View>
        <View>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbar}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: "green" }}
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

export default StudentMyGrades;

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
