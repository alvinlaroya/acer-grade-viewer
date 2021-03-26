import React, {  useEffect  } from 'react';
import { View, StyleSheet, Text} from 'react-native';
import { Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { fb } from '../../firebase';

const loadingIcon = require('../loadingicon.gif');

const db = fb.firestore();

function WelcomeBeforeLoginScreen({route, navigation}) {
    return(
        <View style={styles.container}>
            <Image source={loadingIcon} style={{height: 40, width: 70}}></Image>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Signing In...</Text>
        </View>
    )
}

export default WelcomeBeforeLoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
});