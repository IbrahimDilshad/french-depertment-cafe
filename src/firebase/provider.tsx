
"use client";

import { createContext, useContext, ReactNode } from "react";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Database } from "firebase/database";

export interface FirebaseProviderProps {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  database: Database;
  children?: ReactNode;
}

const FirebaseContext = createContext<FirebaseProviderProps | undefined>(
  undefined
);

export function FirebaseProvider({
  firebaseApp,
  auth,
  firestore,
  database,
  children,
}: FirebaseProviderProps) {
  const value = { firebaseApp, auth, firestore, database };
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().firebaseApp;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
export const useDatabase = () => useFirebase().database;
