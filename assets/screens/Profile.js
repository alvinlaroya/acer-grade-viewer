import React, { Component, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
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
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import { fb } from "../../firebase";
import { useEffect } from "react";

const db = fb.firestore();

const Profile = ({navigation}) => {
  const [session, setSession] = useState({
    fname: "",
    lname: "",
    email: "",
    profile: "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png",
    address: "",
    contact: "",
    accepted: false,
    type: "",
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = () => {
    var tokenRef = db.collection("users").doc(fb.auth().currentUser.uid);
    tokenRef
      .get()
      .then((doc) => {
        if (doc.exists) {
            setSession(prevState => ({
                ...prevState,  
                fname: doc.data().fname,
                lname: doc.data().lname,
                email: doc.data().email,
                profile: doc.data().profile,
                address: doc.data().address,
                contact: doc.data().contact,
                accepted: doc.data().accepted,
                type: doc.data().type,
                requestStatus: doc.data().requestStatus,
            })); 
        } else {
         
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };


  const signOut = async () => {
    /* Speech.speak("Thank your for using fire safety inspection certificate online application. See you again soon"); */
      try {
          await fb.auth().signOut()
          navigation.navigate("SplashScreen")
      } catch (error) {
          console.log(error)
      }
  }

  return session.fname !== '' ? (
    <>
      <StatusBar style="dark" />
      <View style={{alignItems: 'center', padding: 30, marginTop: Constants.statusBarHeight}}>
        <Avatar.Image size={130} source={{uri: session.profile !== '' ? session.profile : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU'}} />
        <Text style={{fontSize: 25, fontWeight: 'bold'}}>{session.fname} {session.lname}</Text>
        <Text style={{fontSize: 15}}>{session.email}</Text>
      </View>
      <View style={{padding: 30, marginTop: -30, flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '50%'}}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>Address: <Text style={{fontWeight: 'normal'}}>{session.address}</Text></Text>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>Contact: <Text style={{fontWeight: 'normal'}}>{session.contact}</Text></Text>
          </View>
          <View style={{width: '50%', justifyContent: 'flex-end', flexDirection: 'row'}}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}><Text style={{fontWeight: 'normal'}}>{session.type}</Text></Text>
          </View>
      </View>
      <View style={{padding: 30, marginTop: -30}}>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Status: {session.requestStatus === 2 ? `Accepted` : `Declined`}</Text>
      </View>
      <View style={{padding: 30, marginTop: -30}}>
        <Button icon="home-outline" mode="outlined" contentStyle={{height: 50, backgroundColor: '#05a148'}} color="#05a148" labelStyle={{color: 'white'}} onPress={() => navigation.goBack()}>
          Back to home
        </Button>
        <Button icon="logout" mode="outlined" contentStyle={{height: 50}} style={{marginTop: 6}} color="#05a148" labelStyle={{color: '#05a148'}} onPress={signOut}>
          Sign out
        </Button>
      </View>
    </>
  ) : (
      <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
          <Text>Loading Information...</Text>
      </View>
  )
};

/* setExampleState({...exampleState,  masterField2: {
    fieldOne: "c",
    fieldTwo: {
       fieldTwoOne: "d",
       fieldTwoTwo: "e"
       }
    },
}}) */

export default Profile;
