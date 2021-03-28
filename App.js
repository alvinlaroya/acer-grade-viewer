import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import {Image, Text, View, Linking} from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { BaseNavigationContainer, NavigationContainer } from '@react-navigation/native';
/* import { LogBox } from 'react-native'; */
import * as Notifications from 'expo-notifications';
/* LogBox.ignoreLogs(['Setting a timer']); */

import SplashScreen from './assets/screens/SplashScreen';
import WelcomeBeforeLogin from './assets/screens/WelcomeBeforeLogin';
import SignInScreen from './assets/screens/SigninScreen';
import SignUpScreen from './assets/screens/SignupScreen';
import NotAcceptedScreen from './assets/screens/NotAcceptedScreen';
import MainScreen from './assets/screens/MainScreen';
import Subjects from './assets/screens/Subjects';
import AddSubjects from './assets/screens/AddSubjects';
import SchoolYear from './assets/screens/SchoolYear';
import AddSchoolYear from './assets/screens/AddSchoolYear';
import AppToken from './assets/screens/AppToken';
import Profile from './assets/screens/Profile';
import Grades from './assets/screens/Grades';
import TeachersRequests from './assets/screens/TeachersRequests';
import StudentsRequests from './assets/screens/StudentsRequests';
import AdminRequests from './assets/screens/AdminRequests';
import SchoolInformation from './assets/screens/SchoolInformation';
import GradesUnderSY from './assets/screens/GradesUnderSY';
import GradesList from './assets/screens/GradesList';
import AddGrade from './assets/screens/AddGrade';
import MyGrades from './assets/screens/MyGrades';
import StudentMyGrades from './assets/screens/StudentMyGrades';
import CommentsList from './assets/screens/CommentsList';
import AddComment from './assets/screens/AddComment';
import UpdateGrade from './assets/screens/UpdateGrade';
import ViewComment from './assets/screens/ViewComment';
import TeachersList from './assets/screens/TeachersList';
import SubjectsUnderTeacher from './assets/screens/SubjectsUnderTeacher';
import StudentsUnderSubjectsTeacher from './assets/screens/StudentsUnderSubjectsTeacher';
import TeacherProfile from './assets/screens/TeacherProfile';
import Teachers from './assets/screens/Teachers';
import EnrolledStudents from './assets/screens/EnrolledStudents';
import Settings from './assets/screens/Settings';
import ChangePassword from './assets/screens/settings/ChangePassword';

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
  }),
});

const App = ({navigation}) => {
  const [notification, setNotification] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log(notification)
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  },[]);


  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.grades;
      /* Linking.openURL(url); */
      // DITO KA MAG LAGAY NG NAVIGATION SCREEN
      console.log(url)
    });
    return () => subscription.remove();
  }, []);


  /* const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }); */

  
  return(
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" animation="spring">
          {/* <Stack.Screen name="SpashScreen" component={SplashScreen} options={{ headerShown: false, cardStyleInterpolator: forFade }}/> */}
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="WelcomeBeforeLogin" component={WelcomeBeforeLogin} options={{ headerShown: false }}/>
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="NotAcceptedScreen" component={NotAcceptedScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Subjects" component={Subjects} options={{ headerShown: false }}/>
          <Stack.Screen name="AddSubjects" component={AddSubjects} options={{ headerShown: false }}/>
          <Stack.Screen name="AppToken" component={AppToken} options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
          <Stack.Screen name="SchoolYear" component={SchoolYear} options={{ headerShown: false }}/>
          <Stack.Screen name="AddSchoolYear" component={AddSchoolYear} options={{ headerShown: false }}/>
          <Stack.Screen name="Grades" component={Grades} options={{ headerShown: false }}/>
          <Stack.Screen name="TeachersRequests" component={TeachersRequests} options={{ headerShown: false }}/>
          <Stack.Screen name="StudentsRequests" component={StudentsRequests} options={{ headerShown: false }}/>
          <Stack.Screen name="AdminRequests" component={AdminRequests} options={{ headerShown: false }}/>
          <Stack.Screen name="SchoolInformation" component={SchoolInformation} options={{ headerShown: false }}/>
          <Stack.Screen name="GradesUnderSY" component={GradesUnderSY} options={{ headerShown: false }}/>
          <Stack.Screen name="GradesList" component={GradesList} options={{ headerShown: false }}/>
          <Stack.Screen name="AddGrade" component={AddGrade} options={{ headerShown: false }}/>
          <Stack.Screen name="MyGrades" component={MyGrades} options={{ headerShown: false }}/>
          <Stack.Screen name="StudentMyGrades" component={StudentMyGrades} options={{ headerShown: false }}/>
          <Stack.Screen name="CommentsList" component={CommentsList} options={{ headerShown: false }}/>
          <Stack.Screen name="AddComment" component={AddComment} options={{ headerShown: false }}/>
          <Stack.Screen name="UpdateGrade" component={UpdateGrade} options={{ headerShown: false }}/>
          <Stack.Screen name="ViewComment" component={ViewComment} options={{ headerShown: false }}/>
          <Stack.Screen name="TeachersList" component={TeachersList} options={{ headerShown: false }}/>
          <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }}/>
          <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }}/>
          <Stack.Screen name="SubjectsUnderTeacher" component={SubjectsUnderTeacher} options={{ headerShown: false }}/>
          <Stack.Screen name="StudentsUnderSubjectsTeacher" component={StudentsUnderSubjectsTeacher} options={{ headerShown: false }}/>
          <Stack.Screen name="EnrolledStudents" component={EnrolledStudents} options={{ headerShown: false }}/>
          <Stack.Screen name="Teachers" component={Teachers} options={{ headerShown: false }}/>
          <Stack.Screen name="TeacherProfile" component={TeacherProfile} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); */
