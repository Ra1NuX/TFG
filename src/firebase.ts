import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"
import {initializeApp} from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB9Esun1j-uTBUU4TDv5LJDZUrQRkGnX5I",
    authDomain: "bbdd-tfg-ec27a.firebaseapp.com",
    projectId: "bbdd-tfg-ec27a",
    storageBucket: "bbdd-tfg-ec27a.appspot.com",
    messagingSenderId: "739311376686",
    appId: "1:739311376686:web:3d53838a76b1074bedc2bf"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const storage = getStorage();
const db = getFirestore();

export { auth, storage, db}