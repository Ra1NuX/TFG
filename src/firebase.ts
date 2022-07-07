import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"
import {initializeApp} from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: /*<API-KEY>*/,
    authDomain: /*authDomain*/,
    projectId: /*projectId*/,
    storageBucket: /*storageBucket*/
    messagingSenderId: /*messagingSenderId*/
    appId: /*appId*/
};

initializeApp(firebaseConfig);

const auth = getAuth();
const storage = getStorage();
const db = getFirestore();

export { auth, storage, db}
