
"use client";

import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useFirebaseApp } from "@/firebase";

// This hook is for REALTIME DATABASE, despite the folder name.
export function useDoc<T>(path: string | null) {
  const app = useFirebaseApp();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!app || !path) {
      setLoading(false);
      setData(null);
      return;
    }

    const db = getDatabase(app);
    const docRef = ref(db, path);
    setLoading(true);

    const unsubscribe = onValue(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
           // The key is the last part of the path
          const id = snapshot.key;
          setData({ id, ...snapshot.val() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err: Error) => {
        console.error(`Error fetching document at ${path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [app, path]);

  return { data, loading, error };
}
