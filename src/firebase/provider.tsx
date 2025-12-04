
"use client";

import { createContext, useContext, ReactNode } from "react";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Database } from "firebase/database";
import type { Firestore } from "firebase/firestore";


export interface FirebaseProviderProps {
  firebaseApp: FirebaseApp;
  auth: Auth;
  database: Database;
  firestore: Firestore; // For backwards compatibility with the hook name
  children?: ReactNode;
}

const FirebaseContext = createContext<FirebaseProviderProps | undefined>(
  undefined
);

export function FirebaseProvider({
  firebaseApp,
  auth,
  database,
  firestore,
  children,
}: FirebaseProviderProps) {
  const value = { firebaseApp, auth, database, firestore };
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
export const useDatabase = () => useFirebase().database;

// This hook name is misleading, it returns the Realtime Database instance.
// This is kept for now to prevent breaking existing components.
export const useFirestore = () => useFirebase().database as any;
