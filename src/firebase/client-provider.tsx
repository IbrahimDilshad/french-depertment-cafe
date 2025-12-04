
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

  if (!firebase || !firebase.firebaseApp || !firebase.auth || !firebase.firestore) {
    // You can render a loading state here if needed
    return null;
  }

  return <FirebaseProvider {...(firebase as FirebaseProviderProps)}>{children}</FirebaseProvider>;
}
