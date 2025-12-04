
"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, Query, DocumentData } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export function useCollection<T>(path: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore) {
      return;
    }

    setLoading(true);
    const collectionRef = collection(firestore, path);

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
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
  }, [firestore, path]);

  return { data, loading, error };
}
