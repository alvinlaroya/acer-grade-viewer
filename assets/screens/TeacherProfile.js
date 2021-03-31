import React, { Component, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { ImageBackground, Image } from "react-native";
import {
  Appbar,
  Avatar,
  Chip,
  Card,
  Button,
  Title,
  Paragraph,
  IconButton,
  Colors,
  TextInput,
  Snackbar
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import MultiSelect from 'react-native-multiple-select';
import firebase from "firebase/app";
import { fb } from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import { useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

const db = fb.firestore();

const TeacherProfile = ({ route, navigation }) => {
  const { teacher, type } = route.params;
  const [snackbar, setSnackbar] = useState(false)
  const [teacherPosition, setTeacherPosition] = useState("");
  const [onUpdate, setOnUpdate] = useState(false)
  const [subjects, setSubjects] = useState([]);

  const [selectedItems, setSelectedItems] = useState(teacher.subjects);

  const onDismissSnackBar = () => setSnackbar(false);

  useEffect(() => {
    const unsubscribe = db.collection("subjects")
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
  }, []);

  const updatePosition = () => {
      db.collection("teachers").doc(teacher.id).update({
          position: teacherPosition,
          subjects: selectedItems,
      }).then(() => {
          setSnackbar(true)
          navigation.goBack()
      })
  }

  const onSelectedItemsChange = (selectedItems) => {
    // Set Selected Items
    setSelectedItems(selectedItems);
  };

  return (
    <ScrollView>
      <IconButton
        icon="arrow-left"
        color="gray"
        size={30}
        onPress={() => navigation.goBack(null)}
        style={{ marginTop: Constants.statusBarHeight + 10 }}
      />
      <StatusBar style="dark" />
      <Snackbar
        visible={snackbar}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: 'green' }}
        action={{
          label: "Close",
          onPress: () => {
            // Do something
          },
        }}
      >
        Posiition Updated Successfuly!
      </Snackbar>
      <View
        style={{
          alignItems: "center",
          padding: 30,
          marginTop: Constants.statusBarHeight,
        }}
      >
        <View>
          <Image
            source={{
              uri:
                teacher.profile !== ""
                  ? teacher.profile
                  : "https://image.flaticon.com/icons/png/512/1089/1089129.png",
            }}
            style={styles.logoProfile}
          ></Image>
        </View>
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          {teacher.fname} {teacher.lname}
        </Text>
        <Text style={{ fontSize: 15 }}>{teacher.email}</Text>
      </View>
      <View
        style={{
          padding: 30,
          marginTop: -30,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "50%" }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Address:{" "}
            <Text style={{ fontWeight: "normal" }}>{teacher.address}</Text>
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Contact:{" "}
            <Text style={{ fontWeight: "normal" }}>{teacher.contact}</Text>
          </Text>
        </View>
        <View
          style={{
            width: "50%",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            <Text style={{ fontWeight: "normal" }}>
              <Text style={{ fontWeight: "bold" }}>Position </Text>
              {teacher.position}
            </Text>
          </Text>
        </View>
      </View>
      <View style={{ padding: 30, marginTop: -20 }}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          Subjects {type}
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ padding: 6 }}
        >
          {teacher.subjects.map((subject, index) => (
            <Chip
              key={index}
              icon="account-check"
              onPress={() => navigation.navigate("TeachersRequests")}
              style={{ marginRight: 15, height: 35 }}
            >
              {subject}
            </Chip>
          ))}
        </ScrollView>
      </View>
      {type === "Admin" && (
        <View style={{ padding: 30, marginTop: -30 }}>
          {onUpdate ? (
              <>
                <MultiSelect
                  hideTags
                  items={subjects}
                  uniqueKey="name"
                  onSelectedItemsChange={onSelectedItemsChange}
                  selectedItems={selectedItems}
                  selectText="Pick Subjects"
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={(text) => console.log(text)}
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{color: '#CCC'}}
                  submitButtonColor="#48d22b"
                  submitButtonText="Done"
                />
                <TextInput
                    dense={true}
                    label={`Old Position (${teacher.position})`}
                    onChangeText={(position) => setTeacherPosition(position)}
                />
                <Button
                    icon="home-outline"
                    mode="outlined"
                    contentStyle={{ height: 50, backgroundColor: "#05a148" }}
                    color="#05a148"
                    labelStyle={{ color: "white" }}
                    style={{marginTop: 5}}
                    onPress={updatePosition}
                    >
                    Save Changes
                </Button>
                <Button
                    icon="home-outline"
                    mode="outlined"
                    contentStyle={{ height: 50, backgroundColor: "#dbb509" }}
                    color="#05a148"
                    labelStyle={{ color: "white" }}
                    style={{marginTop: 5}}
                    onPress={() => setOnUpdate(false)}
                    >
                    Cancel
                </Button>
              </>
          ) : (
            <Button
                icon="home-outline"
                mode="outlined"
                contentStyle={{ height: 50, backgroundColor: "#05a148" }}
                color="#05a148"
                labelStyle={{ color: "white" }}
                onPress={() => setOnUpdate(true)}
            >
                Update {teacher.fname}
            </Button>
          )}
        </View>
      )}
    </ScrollView>
  );
};

/* setExampleState({...exampleState,  masterField2: {
    fieldOne: "c",
    fieldTwo: {
       fieldTwoOne: "d",
       fieldTwoTwo: "e"
       }
    },
}}) */

export default TeacherProfile;

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
});
