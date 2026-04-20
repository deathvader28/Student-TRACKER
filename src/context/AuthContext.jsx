// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase wasn't initialized (e.g. missing env vars), skip
    // the listener and mark loading as finished so the UI can render.
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Wrap auth functions so they fail gracefully when `auth` is not available.
  const signup = (email, password) => {
    if (!auth) return Promise.reject({ code: "no-firebase", message: "Firebase not configured" });
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    if (!auth) return Promise.reject({ code: "no-firebase", message: "Firebase not configured" });
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) return Promise.reject({ code: "no-firebase", message: "Firebase not configured" });
    return signOut(auth);
  };

  const value = {
    user,
    loading,   // ✅ IMPORTANT
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};