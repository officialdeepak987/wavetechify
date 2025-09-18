
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For more information on how to use this object, see the following page:
// https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  projectId: "techify-solutions-bxl7n",
  appId: "1:45305021841:web:2f684031570317a726c630",
  storageBucket: "techify-solutions-bxl7n.firebasestorage.app",
  apiKey: "AIzaSyBlG1ZkInB66Fu36YdL5E8qeEcW-Nd-03w",
  authDomain: "techify-solutions-bxl7n.firebaseapp.com",
  messagingSenderId: "45305021841"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
