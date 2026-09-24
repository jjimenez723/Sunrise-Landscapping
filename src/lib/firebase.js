const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured =
  Object.values(firebaseConfig).every(Boolean);

let leadStore;

// Load the delivery SDK only when a configured site submits a request.
export function getLeadStore() {
  if (!isFirebaseConfigured)
    throw new Error("Lead delivery is not configured.");
  if (!leadStore) {
    leadStore = Promise.all([
      import("firebase/app"),
      import("firebase/firestore"),
    ])
      .then(([app, firestore]) => ({
        addDoc: firestore.addDoc,
        collection: firestore.collection,
        serverTimestamp: firestore.serverTimestamp,
        db: firestore.getFirestore(
          app.getApps().length
            ? app.getApp()
            : app.initializeApp(firebaseConfig),
        ),
      }))
      .catch((error) => {
        leadStore = undefined;
        throw error;
      });
  }
  return leadStore;
}
