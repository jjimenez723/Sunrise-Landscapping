import { getLeadStore, isFirebaseConfigured } from "../lib/firebase";

const LOCAL_QUEUE_KEY = "sunrise-landscapping-quote-requests";

export async function submitQuoteRequest(formData, source = "website") {
  const request = {
    ...formData,
    source,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured) {
    const { db, addDoc, collection, serverTimestamp } = await getLeadStore();
    request.createdAt = serverTimestamp();
    const saved = await addDoc(collection(db, "quoteRequests"), request);
    return { mode: "firebase", id: saved.id };
  }

  // A local draft is never a delivered lead or an automatic send queue.
  let drafts = [];
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || "[]");
    if (Array.isArray(saved)) drafts = saved;
  } catch {
    // A damaged local draft must not prevent starting a new one.
  }
  try {
    localStorage.setItem(
      LOCAL_QUEUE_KEY,
      JSON.stringify([...drafts.slice(-19), request]),
    );
  } catch {
    // Storage restrictions must not prevent the email/text handoff.
  }
  return { mode: "draft" };
}
