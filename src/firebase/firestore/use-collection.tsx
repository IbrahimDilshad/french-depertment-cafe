
"use client";

import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, Database } from "firebase/database";
import { useFirebaseApp } from "@/firebase";

// This hook is for REALTIME DATABASE, despite the folder name.
export function useCollection<T>(path: string) {
  const app = useFirebaseApp();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!app) {
      return;
    }

    const db = getDatabase(app);
    const dbRef = ref(db, path);
    setLoading(true);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          // Transform the object of objects into an array of objects,
          // with the key included as the 'id' field.
          const documents = Object.keys(val).map((key) => ({
            id: key,
            ...val[key],
          })) as T[];
          setData(documents);
        } else {
          setData([]); // Handle case where collection is empty
        }
        setLoading(false);
        setError(null);
      },
      (err: Error) => {
        console.error(`Error fetching collection at ${path}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [app, path]);

  return { data, loading, error };
}
