// src/context/TaskContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

// ---------------------------------------------------------------------------
// 1. Create the Task context
// ---------------------------------------------------------------------------
const TaskContext = createContext();

// ---------------------------------------------------------------------------
// 2. Custom hook for consuming task context
//    Usage: const { tasks, addTask, deleteTask, toggleTask } = useTasks();
// ---------------------------------------------------------------------------
export const useTasks = () => useContext(TaskContext);

// ---------------------------------------------------------------------------
// 3. TaskProvider — wraps the app and provides task state globally
// ---------------------------------------------------------------------------
export const TaskProvider = ({ children }) => {
  const { user } = useAuth(); // get the currently logged-in user

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------------------
  // Fetch tasks from Firestore in real time using onSnapshot
  // Re-runs whenever the logged-in user changes
  // -------------------------------------------------------------------------
  useEffect(() => {
    // If no user is logged in, clear tasks and stop
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    // If Firestore isn't configured, avoid subscribing and keep tasks empty
    if (!db) {
      setTasks([]);
      setLoading(false);
      return;
    }

    // Query: get all tasks belonging to the current user, ordered by creation time
    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    // onSnapshot listens for real-time updates from Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,       // Firestore document ID
        ...doc.data(),    // all other fields (title, completed, createdAt, etc.)
      }));
      setTasks(fetchedTasks);
      setLoading(false);
    });

    // Cleanup: stop listening when user logs out or component unmounts
    return () => unsubscribe();
  }, [user]);

  // -------------------------------------------------------------------------
  // Add a new task to Firestore
  // -------------------------------------------------------------------------
  const addTask = async (title) => {
  if (!title.trim()) return;

  try {
    await addDoc(collection(db, "tasks"), {
      title: title.trim(),
      completed: false,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("ERROR ADDING TASK:", err);
  }
};

  // -------------------------------------------------------------------------
  // Delete a task from Firestore by its document ID
  // -------------------------------------------------------------------------
  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  // -------------------------------------------------------------------------
  // Toggle a task's completed status (true → false, false → true)
  // -------------------------------------------------------------------------
  const toggleTask = async (taskId, currentStatus) => {
    await updateDoc(doc(db, "tasks", taskId), {
      completed: !currentStatus,
    });
  };

  // -------------------------------------------------------------------------
  // Derive overdue tasks:
  // Tasks that were created on a PREVIOUS day and are still NOT completed
  // -------------------------------------------------------------------------
  const today = new Date().toDateString(); // e.g. "Mon Apr 20 2026"

  const overdueTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt).toDateString();
    return !task.completed && taskDate !== today;
  });

  // -------------------------------------------------------------------------
  // Stats — simple counts for the dashboard summary
  // -------------------------------------------------------------------------
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  // -------------------------------------------------------------------------
  // Value shared with the rest of the app
  // -------------------------------------------------------------------------
  const value = {
    tasks,
    overdueTasks,
    loading,
    addTask,
    deleteTask,
    toggleTask,
    completedCount,
    pendingCount,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};