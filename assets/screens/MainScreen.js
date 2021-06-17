import React, { Component, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text  } from 'react-native';
import { ImageBackground, Image } from 'react-native';
import { Appbar, Avatar, Chip, Card, Button, Title, Paragraph, IconButton, Colors} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import firebase from "firebase/app";
import { fb } from '../../firebase';
const db = fb.firestore();

import ChipsMenu from '../screens/components/ChipsMenu';
import CardListButton from '../screens/components/CardListButton';

import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
/* import FloatingAction from '../component/FloatingActionComponent'; */

/* const bg = require('../citybackground.jpg'); */
var logo = require('../icon.png');

const MainScreen = ({route, navigation}) => {
    const { 
        userId, fname, lname, email, contact, address, profile, type
     } = route.params

    const [myToken, setToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync()
    }, [])

    const signOut = async () => {
        /* Speech.speak("Thank your for using fire safety inspection certificate online application. See you again soon"); */
        try {
            await fb.auth().signOut()
            navigation.navigate("SplashScreen")
        } catch (error) {
            console.log(error)
        }
    }

    const registerForPushNotificationsAsync = async () => {
        setTimeout(async () => {
            console.log("POTA")
            let token;
            if (Constants.isDevice) {
                const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Failed to get push token for push notification!');
                    return;
                }
                token = (await Notifications.getExpoPushTokenAsync()).data;
                
                db.collection("users")
                .doc(firebase.auth().currentUser.uid).update({
                    token: token
                })

                type === "Student" && db.collection("students").doc(firebase.auth().currentUser.uid).update({
                    token: token
                })

                type === "Teacher" && db.collection("teachers").doc(firebase.auth().currentUser.uid).update({
                    token: token
                })
                
                

                setToken(token)
                console.log(token)
            } else {
                alert('Must use physical device for Push Notifications');
            }
        
            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        }, 5000)
    }

    

    return (
        <>
            <StatusBar style="dark"/>
            <View style={{padding: 30, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '80%'}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 5,}}>{fname} {lname} ({type})</Text>
                    <Text style={{fontSize: 12, marginTop: 5}}>{email}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '20%'}}>
                    <Avatar.Image size={44} source={{uri: profile !== '' ? profile : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe330tYy_U_3UN0DmUSbGoFbXigdIQglDAA&usqp=CAU'}} />
                    <IconButton
                        icon="logout"
                        color="gray"
                        size={33}
                        onPress={signOut}
                        style={{marginTop: -2, marginRight: -20}}
                    />
                </View>
            </View>
            <View style={{ height: 60, marginTop: -10, backgroundColor: 'white', borderBottomColor: 'black', borderBottomWidth: .5}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ padding: 6 }}
              >
                <ChipsMenu 
                    id={userId}
                    name={`${fname} ${lname}`}
                    contact={contact}
                    address={{address}}
                    profile={profile} 
                    type={type}
                    email={email}
                />
              </ScrollView>
            </View>
            <ScrollView style={{padding: 20}} showsVerticalScrollIndicator={false}>
                <CardListButton type={type} userId={userId}/>
            </ScrollView>
            <View style={{height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
                <Text style={{fontSize: 8}}>SFIS MOBILE GRADE VIEWER</Text>
            </View>
        </>
    )
}


export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottom: {
        backgroundColor: 'white',
        elevation: 0
    },
    ops:{
        fontWeight: 'bold',
        fontSize: 22
    },
    opsDesc:{
        fontSize: 14
    },
    link:{
        fontSize: 14,
        color: '#c90632'
    }
});