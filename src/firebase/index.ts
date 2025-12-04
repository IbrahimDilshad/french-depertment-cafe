
"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { firebaseConfig } from "./config";

import { FirebaseClientProvider } from "./client-provider";
import {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore, // This will be deprecated/renamed
  useAuth,
  useDatabase,
} from "./provider";
import { useUser } from "./auth/use-user";
import { useCollection } from "./firestore/use-collection";
import { useDoc } from "./firestore/use-doc";


let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let database: Database | undefined;

function initializeFirebase() {
  if (!firebaseApp) {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }
    auth = getAuth(firebaseApp);
    database = getDatabase(firebaseApp);
  }
  
  return { firebaseApp, auth, database };
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
  useFirestore, // Keep for now to avoid breaking changes, but it's using RTDB
  useAuth,
  useDatabase,
};
