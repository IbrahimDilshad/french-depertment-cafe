
"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

import { FirebaseClientProvider } from "./client-provider";
import {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useDatabase,
  useAuth,
} from "./provider";
import { useUser } from "./auth/use-user";
import { useCollection } from "./firestore/use-collection";
import { useDoc } from "./firestore/use-doc";

let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let database: Database | undefined;

function initializeFirebase() {
  if (!firebaseApp) {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
    database = getDatabase(firebaseApp);
  }
  
  return { firebaseApp, auth, firestore, database };
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
  useDatabase,
  useAuth,
};
