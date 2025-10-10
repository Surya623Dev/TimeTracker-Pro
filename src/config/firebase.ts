import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAaHocOn2_XKrw-v7hU1QaDVWUiOITdTWM",
  authDomain: "voicescribe-app-e6254.firebaseapp.com",
  projectId: "voicescribe-app-e6254",
  storageBucket: "voicescribe-app-e6254.appspot.com",
  messagingSenderId: "368501491082",
  appId: "1:368501491082:web:89aa642f4a40d02f287473"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;