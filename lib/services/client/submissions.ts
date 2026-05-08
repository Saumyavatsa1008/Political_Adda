import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface TipSubmission {
  id?: string;
  title: string;
  description: string;
  location: string;
  imageUrl?: string | null;
  contactInfo?: string | null;
  status: "pending" | "reviewed" | "published";
  createdAt: any;
}

export async function submitGroundReport(data: Omit<TipSubmission, "id" | "status" | "createdAt">) {
  try {
    const submissionsRef = collection(db, "submissions");
    const newDocRef = doc(submissionsRef);
    
    await setDoc(newDocRef, {
      ...data,
      id: newDocRef.id,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    
    return newDocRef.id;
  } catch (error) {
    console.error("Error submitting report:", error);
    throw new Error("Failed to submit your report. Please try again.");
  }
}
