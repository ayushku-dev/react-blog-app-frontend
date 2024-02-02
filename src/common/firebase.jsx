// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const apiKeyValue = import.meta.env.VITE_REACT_APP_API_KEY;
const authDomainValue = import.meta.env.VITE_REACT_APP_AUTH_DOMAIN;
const projectIdValue = import.meta.env.VITE_REACT_APP_PROJECT_ID;
const storageBucketValue = import.meta.env.VITE_REACT_APP_STORAGE_BUCKET;
const messagingSenderIdValue = import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID;
const appIdValue = import.meta.env.VITE_REACT_APP_APP_ID;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKeyValue,
  authDomain: authDomainValue,
  projectId: projectIdValue,
  storageBucket: storageBucketValue,
  messagingSenderId: messagingSenderIdValue,
  appId: appIdValue
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Google Auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;
    await signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user;
        })
        .catch((err) => {
            console.log(err);
        })
        return user;
}