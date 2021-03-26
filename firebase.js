import firebase from 'firebase';

// Optionally import the services that you want to use
import "firebase/auth";
/* import "firebase/database"; */
import "firebase/firestore";
/* import "firebase/functions"; */
import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDwMBx32l5BSo4YwBAM--yE_il5jjRmkf8",
  authDomain: "ace-grade-viewer.firebaseapp.com",
  projectId: "ace-grade-viewer",
  storageBucket: "ace-grade-viewer.appspot.com",
  messagingSenderId: "416237473218",
  appId: "1:416237473218:web:292aa3880ae59a489f9a5b",
  measurementId: "G-XZSHS0MJQZ"
  
};

export const fb = firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ experimentalForceLongPolling: true });