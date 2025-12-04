
"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

import { FirebaseClientProvider } from "./client-provider";
import {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from "./provider";
import { useUser } from "./auth/use-user";
import { useCollection } from "./firestore/use-collection";
import { useDoc } from "./firestore/use-doc";

// This function is memoized, so it will only run once.
let firebaseApp: FirebaseApp | undefined;
function getFirebaseApp() {
  if (firebaseApp) {
    return firebaseApp;
  }
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
  return firebaseApp;
}

function initializeFirebase() {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { firebaseApp: app, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useUser,
  useCollection,
  useDoc,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
