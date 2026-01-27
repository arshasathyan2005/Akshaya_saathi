import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCPqez-qt7scS7rwjyzfMlev4_5ZWSLBH0",
  authDomain: "akshaya-saathi.firebaseapp.com",
  projectId: "akshaya-saathi",
  storageBucket: "akshaya-saathi.firebasestorage.app",
  messagingSenderId: "676372634772",
  appId: "1:676372634772:web:4dadc11deca5a21662a881"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
