import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBHMsAAH4VGSKnVRncrx-v1Jccucv2J2ug",
  authDomain: "opet-a17ff.firebaseapp.com",
  projectId: "opet-a17ff",
  storageBucket: "opet-a17ff.appspot.com",
  messagingSenderId: "254915116603",
  appId: "1:254915116603:web:d190eeba40cb511d0fa61e",
  storageBucket:"gs://opet-a17ff.appspot.com"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
