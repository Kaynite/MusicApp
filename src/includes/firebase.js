import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlCyy2xHIf22xQVwZujQxBGeR77j5DK2k",
  authDomain: "music-24c58.firebaseapp.com",
  projectId: "music-24c58",
  storageBucket: "music-24c58.appspot.com",
  appId: "1:815517529778:web:3c50d5e7b66a625f1e7bab",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");

export {
  auth,
  db,
  storage,
  usersCollection,
  songsCollection,
  commentsCollection,
};
