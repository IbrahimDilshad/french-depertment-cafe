
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { firebaseConfig } from "./config";

// This function is safe to call on the server
export function initializeServerApp(): { firebaseApp: FirebaseApp } {
  const apps = getApps();
  if (apps.length > 0) {
    return { firebaseApp: getApp() };
  }
  
  const firebaseApp = initializeApp(firebaseConfig);
  
  return { firebaseApp };
}
