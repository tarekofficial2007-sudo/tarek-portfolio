// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdQjPbMXIQNzpmelvA2JfMDCUyw5iib5w",
  authDomain: "tarek-chef.firebaseapp.com",
  databaseURL: "https://tarek-chef-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tarek-chef",
  storageBucket: "tarek-chef.firebasestorage.app",
  messagingSenderId: "1005599998835",
  appId: "1:1005599998835:web:a1d9ae3826b999bc987b06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);