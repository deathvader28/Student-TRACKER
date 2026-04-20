// src/pages/Dashboard.jsx

import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import Navbar from "../components/Navbar";
import TaskItem from "../components/TaskItem";

const Dashboard = () => {
  const [taskTitle, setTaskTitle] = useState("");

  const {
    tasks,
    overdueTasks,
    loading,
    addTask,
    completedCount,
    pendingCount,
  } = useTasks();

  const today = new Date().toDateString();

  // ✅ FIXED: safe filtering
  const todaysTasks = tasks.filter((task) => {
    if (!task.createdAt) return false; // ignore broken tasks
    const taskDate = new Date(task.createdAt).toDateString();
    return taskDate === today;
  });

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) return;

    await addTask(taskTitle); // ✅ correct usage
    setTaskTitle("");
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />

      <div style={styles.container}>
        <h1 style={styles.heading}>📚 Study Execution Tracker</h1>

        <p style={styles.date}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Stats */}
        <div style={styles.statsBar}>
          <div style={{ ...styles.statCard, borderLeft: "4px solid #48bb78" }}>
            <span style={styles.statNumber}>{completedCount}</span>
            <span style={styles.statLabel}>Completed</span>
          </div>

          <div style={{ ...styles.statCard, borderLeft: "4px solid #f6ad55" }}>
            <span style={styles.statNumber}>{pendingCount}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>

          <div style={{ ...styles.statCard, borderLeft: "4px solid #fc8181" }}>
            <span style={styles.statNumber}>{overdueTasks.length}</span>
            <span style={styles.statLabel}>Overdue</span>
          </div>
        </div>

        {/* Add Task */}
        <form onSubmit={handleAddTask} style={styles.form}>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            style={styles.input}
          />
          <button type="submit" style={styles.addButton}>
            + Add Task
          </button>
        </form>

        {/* Loading */}
        {loading && <p style={styles.loading}>Loading tasks...</p>}

        {/* Overdue */}
        {overdueTasks.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitleOverdue}>
              ⚠️ Overdue Tasks ({overdueTasks.length})
            </h2>

            <div style={styles.taskList}>
              {overdueTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Today */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            📝 Today's Tasks ({todaysTasks.length})
          </h2>

          {!loading && todaysTasks.length === 0 && (
            <p style={styles.emptyMessage}>
              No tasks for today yet. Add one above!
            </p>
          )}

          <div style={styles.taskList}>
            {todaysTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
  },
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  heading: {
    fontSize: "1.8rem",
    color: "#1a202c",
  },
  date: {
    color: "#718096",
    marginBottom: "1.5rem",
  },
  statsBar: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    flex: 1,
    textAlign: "center",
  },
  statNumber: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#718096",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "1.5rem",
  },
  input: {
    flex: 1,
    padding: "10px",
  },
  addButton: {
    padding: "10px 15px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  section: {
    marginTop: "1.5rem",
  },
  sectionTitle: {
    marginBottom: "10px",
  },
  sectionTitleOverdue: {
    color: "red",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  emptyMessage: {
    color: "#888",
  },
  loading: {
    textAlign: "center",
  },
};

export default Dashboard;