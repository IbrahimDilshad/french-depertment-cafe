"use client";

import { useEffect, useState } from "react";
import { initializeFirebase } from "@/firebase";
import { FirebaseProvider, FirebaseProviderProps } from "./provider";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<FirebaseProviderProps | null>(null);

  useEffect(() => {
    const firebaseInstances = initializeFirebase();
    setFirebase(firebaseInstances);
  }, []);

  if (!firebase) {
    // You can render a loading state here if needed
    return null;
  }

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
