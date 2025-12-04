
"use client";

import { useState, useEffect } from "react";
import { ref, onValue, DatabaseReference, DataSnapshot } from "firebase/database";
import { useDatabase } from "@/firebase";

export function useCollection<T>(path: string) {
  const db = useDatabase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) {
      return;
    }

    setLoading(true);
    const dbRef: DatabaseReference = ref(db, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          // Realtime Database returns an object, so we convert it to an array
          const documents = Object.keys(val).map(key => ({
            id: key,
            ...val[key],
          })) as T[];
          setData(documents);
        } else {
          setData([]);
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
  }, [db, path]);

  return { data, loading, error };
}
