
"use client";

import { useEffect, useState } from "react";
import { initializeFirebase } from "@/firebase";
import { FirebaseProvider, FirebaseProviderProps } from "./provider";

// This ensures all the properties are optional when initializing
type NullableFirebaseProviderProps = {
  [K in keyof FirebaseProviderProps]?: FirebaseProviderProps[K] | null;
}

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<NullableFirebaseProviderProps | null>(null);

  useEffect(() => {
    const firebaseInstances = initializeFirebase();
    setFirebase(firebaseInstances);
  }, []);

  if (!firebase || !firebase.firebaseApp || !firebase.auth || !firebase.database) {
    // You can render a loading state here if needed
    return null;
  }

  // Casting because we've checked for nulls above.
  // The firestore prop will point to the database instance.
  const providerProps: FirebaseProviderProps = {
     firebaseApp: firebase.firebaseApp,
     auth: firebase.auth,
     database: firebase.database,
     firestore: firebase.database as any, // Maintain compatibility with useFirestore hook
  }

  return <FirebaseProvider {...providerProps}>{children}</FirebaseProvider>;
}
