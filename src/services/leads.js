import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";

const LOCAL_QUEUE_KEY = "new-sunrise-quote-requests";

export async function submitQuoteRequest(formData) {
  const request = {
    ...formData,
    source: "website",
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
  };

  if (isFirebaseConfigured) {
    const saved = await addDoc(collection(db, "quoteRequests"), request);
    return { mode: "firebase", id: saved.id };
  }

  const queued = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || "[]");
  queued.push({ ...request, createdAt: new Date().toISOString() });
  localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(queued));
  return { mode: "local" };
}
