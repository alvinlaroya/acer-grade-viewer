import React, { Component, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
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

import firebase from "firebase/app";
import { fb } from "../../firebase";
import "firebase/auth";
import 'firebase/firestore';
import "firebase/storage";

import { useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';

var user = fb.auth().currentUser;

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

  const [image, setImage] = useState('');
  const [profileImage, setProfileImage] = useState('')

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

            setImage(doc.data().profile)
        } else {
         
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
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
      }).catch((error) => {
        alert(error)
      })
      
      console.log('image url', result.uri)
      setImage(result.uri)
    }
  }

  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = fb.storage().ref().child("profileImages/" + imageName);

    ref.put(blob).on(
      "state_changed",
      (snapshot) => {
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        ref
        .getDownloadURL()
        .then((url) => {
          //from url you can fetched the uploaded image easily
          /* setProfileImage(url) */
          let userRef = db.collection("users").doc(fb.auth().currentUser.uid);
          userRef.update({
            profile: url
          })

          user.updateProfile({
            photoURL: url
          }).then(function() {
            // Update successful.
          }).catch(function(error) {
            // An error happened.
          });
        })
      }
    );
  }


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
        <View>
            <TouchableOpacity  onPress={pickImage}>
              <Image source={{uri: image !== '' ? image : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU'}} style={styles.logoProfile}></Image>
          </TouchableOpacity>
          <Text style={{textAlign: 'center', marginTop: -15, marginBottom: 15}}>
              {image !== '' ? "Change Profile Picture" : "Select Profile Picture"}
          </Text>
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10
  },
  logoProfile: {
      width: 145,
      height: 145,
      borderRadius: 100,
      marginBottom: 20,
      marginTop: 15
  }
});
