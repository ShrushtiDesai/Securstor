// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMktYsXR8Hft-O2EI34EiYkstjg08VCU8",
  authDomain: "fileshareproject-f8230.firebaseapp.com",
  projectId: "fileshareproject-f8230",
  storageBucket: "fileshareproject-f8230.appspot.com",
  messagingSenderId: "704796242152",
  appId: "1:704796242152:web:34710cebfc93f4d16ad95d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
