"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from "firebase/firestore";
import { useFirestore } from "@/firebase";

export function useCollection<T>(path: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!firestore) {
      return;
    }

    const collectionQuery: Query<DocumentData> = query(collection(firestore, path));

    const unsubscribe = onSnapshot(
      collectionQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path]);

  return { data, loading, error };
}
