"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { auth, db } from "../lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ADMIN_EMAILS } from "../lib/constants";

interface AuthContextType {
  user: User | null;
  role: "admin" | "user" | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const isAdminInList = currentUser.email && ADMIN_EMAILS.includes(currentUser.email);
        const userDocRef = doc(db, "users", currentUser.uid);
        
        try {
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            let currentRole = userDoc.data().role || "user";
            
            // If user is in the hardcoded admin list but Firestore says 'user', upgrade them
            if (isAdminInList && currentRole !== "admin") {
              await setDoc(userDocRef, { role: "admin" }, { merge: true });
              currentRole = "admin";
            }
            
            setRole(currentRole);
          } else {
            // Create user document if it doesn't exist
            const initialRole = isAdminInList ? "admin" : "user";
            await setDoc(userDocRef, {
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: initialRole,
              createdAt: new Date(),
            });
            setRole(initialRole);
          }
        } catch (error) {
          console.error("Error fetching/setting user document:", error);
          // Fallback: set role locally based on email list even if Firestore fails
          setRole(isAdminInList ? "admin" : "user");
        }
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
