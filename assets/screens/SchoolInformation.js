import React, { Component, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, FlatList, ImageBackground, Image} from "react-native";
import { Appbar, List, IconButton} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
const schoolPic = require('../image1.jpg');
const schoolLogo = require('../acelogo.png')

const SchoolInfo = ({navigation}) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: 'white'}}>
            <StatusBar style="dark" />
            <ImageBackground 
                style={{
                    width: '100%',
                    height: 250
                }}
                source={schoolPic}
            >
                <IconButton
                    icon="arrow-left"
                    color="white"
                    size={28}
                    onPress={() => navigation.goBack(null)}
                    style={{marginTop: Constants.statusBarHeight + 10, marginLeft: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                />
            </ImageBackground>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20
            }}>
                <View style={{width: '30%'}}>
                    <Image
                        style={{
                            height: 100, width: 100,
                            borderRadius: 100
                        }}
                        source={schoolLogo}
                    ></Image>
                </View>
                <View style={{width: '70%'}}>
                    <Text style={{
                        fontSize: 17, fontWeight: 'bold',
                        marginTop: 20
                    }}>
                        SFIS MOBILE GRADE VIEWER APPLICATION OF SAN FABIAN INTEGRATED SCHOOL SPED CENTER
                    </Text>
                </View>
            </View>
            <View style={{padding: 10}}> 
                <View style={{backgroundColor: 'blue', height: 70, justifyContent: 'center', borderRadius: 20}}>
                    <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: 'white'}}>DEPED VISION</Text>
                </View>
                <Text style={{...styles.vissionText, marginTop: 20}}>We dream of Filipinos</Text>
                <Text style={styles.vissionText}>who passionately love their country</Text>
                <Text style={styles.vissionText}>and whose competencies and values</Text> 
                <Text style={styles.vissionText}>enable them to realize their full potential</Text>
                <Text style={styles.vissionText}>and contribute meaningfully to building the nation.</Text>

                <Text style={{...styles.vissionText, marginTop: 20}}>As learner-centered public institution</Text>
                <Text style={styles.vissionText}>the Department of Education continously improces iteself</Text> 
                <Text style={styles.vissionText}>to better service its stakeholders.</Text>
            </View>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between'
            }}>
                <View style={{width: '50%'}}>
                    <Image source={require('../image2.jpg')} style={{width: '100%', height: 200}}></Image>
                </View>
                <View style={{width: '50%'}}>
                    <Image source={require('../image3.jpg')} style={{width: '100%', height: 100}}></Image>
                    <Image source={require('../image4.jpg')} style={{width: '100%', height: 100}}></Image>
                </View>
            </View>
            <View style={{marginTop: 30, padding: 10}}>
                <View style={{backgroundColor: 'red', height: 70, justifyContent: 'center', borderRadius: 20}}>
                    <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: 'white'}}>DEPED CORE VALUES</Text>
                </View>
                <Text style={{...styles.coreText, marginTop: 20}}>Maka-Diyos</Text>
                <Text style={styles.coreText}>Maka-tao</Text>
                <Text style={styles.coreText}>Makakalikasan</Text>
                <Text style={styles.coreText}>Makabansa</Text>
            </View>
            <View style={{marginBottom: 20, marginTop: 30, padding: 10}}>
             <View style={{backgroundColor: 'blue', height: 70, justifyContent: 'center', borderRadius: 20}}>
                    <Text style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: 'white'}}>DEPED MISSION</Text>
                </View>
                <Text style={{...styles.missionText, marginTop: 20}}>To protect and promote the right of every Filipino</Text>
                <Text style={styles.missionText}>to quality, equitable, culture-based,</Text>
                <Text style={styles.missionText}>and complete basic eduucation where:</Text>

                <Text style={{...styles.missionText, marginTop: 20}}>Students learn in child-friendly, gender sensitive,</Text>
                <Text style={styles.missionText}>safe and motivating environment</Text>

                <Text style={{...styles.missionText, marginTop: 20}}>Teachers facilitat learning and constantly nurture every learner</Text>

                <Text style={{...styles.missionText, marginTop: 20}}>Administrators and staff, as stewards of the institution,</Text> 
                <Text style={styles.missionText}>ensure enabling and supportive environment</Text>
                <Text style={styles.missionText}>for effective learning to happen</Text>

                <Text style={{...styles.missionText, marginTop: 20}}>Family, community and other stakeholders are actively engaged</Text>
                <Text style={styles.missionText}>and share responsibility for developing lifelong learners.</Text>
            </View>
        </ScrollView>
    )
}

export default SchoolInfo;

const styles = StyleSheet.create({
    vissionText: {
        fontSize: 16,
        textAlign: 'center'
    },
    missionText: {
        fontSize: 16,
        textAlign: 'center'
    },
    coreText: {
        fontSize: 16,
        textAlign: 'center'
    }
})