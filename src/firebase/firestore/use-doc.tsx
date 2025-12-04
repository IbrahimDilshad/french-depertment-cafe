
"use client";

import { useState, useEffect } from "react";
import { ref, onValue, DatabaseReference } from "firebase/database";
import { useDatabase } from "@/firebase";

export function useDoc<T>(path: string | null) {
  const db = useDatabase();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db || !path) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
    const dbRef: DatabaseReference = ref(db, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.key, ...snapshot.val() } as T);
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
  }, [db, path]);

  return { data, loading, error };
}
