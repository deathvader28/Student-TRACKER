import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Build firebase config from environment. If env vars are missing we
// avoid calling initializeApp so the app doesn't crash during dev or tests.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let db = null;

const hasConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

if (hasConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    // If initialization fails, log and continue with null exports so
    // the rest of the app can show a helpful message instead of crashing.
    // The app's contexts check for `auth`/`db` before using them.
    // eslint-disable-next-line no-console
    console.warn("Firebase initialization failed:", err);
    app = null;
    auth = null;
    db = null;
  }
} else {
  // eslint-disable-next-line no-console
  console.warn("Firebase config missing. Auth and Firestore are disabled.");
}

export { auth, db, app };