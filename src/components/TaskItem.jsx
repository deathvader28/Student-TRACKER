// src/components/TaskItem.jsx

import { useTasks } from "../context/TaskContext";

const TaskItem = ({ task }) => {
  const { toggleTask, deleteTask } = useTasks();

  // -------------------------------------------------------------------------
  // Format the createdAt date into a readable string
  // e.g. "Apr 20, 2026"
  // -------------------------------------------------------------------------
  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div
      style={{
        ...styles.card,
        // Dim the card slightly if task is completed
        opacity: task.completed ? 0.7 : 1,
        // Green left border for completed, grey for pending
        borderLeft: task.completed
          ? "4px solid #48bb78"
          : "4px solid #cbd5e0",
      }}
    >
      {/* Left side — checkbox + task title */}
      <div style={styles.leftSection}>
        {/* Checkbox to toggle complete/incomplete */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id, task.completed)}
          style={styles.checkbox}
        />

        <div style={styles.textGroup}>
          {/* Task title — strikethrough if completed */}
          <span
            style={{
              ...styles.title,
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "#a0aec0" : "#2d3748",
            }}
          >
            {task.title}
          </span>

          {/* Date the task was created */}
          <span style={styles.date}>📅 {formattedDate}</span>
        </div>
      </div>

      {/* Right side — delete button */}
      <button
        onClick={() => deleteTask(task.id)}
        style={styles.deleteButton}
        title="Delete task"
      >
        🗑️
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Inline styles
// ---------------------------------------------------------------------------
const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "0.85rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    transition: "opacity 0.2s ease",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flex: 1,
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#4f46e5", // purple checkmark color
    flexShrink: 0,
  },
  textGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  },
  title: {
    fontSize: "1rem",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },
  date: {
    fontSize: "0.78rem",
    color: "#a0aec0",
  },
  deleteButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.1rem",
    padding: "0.3rem",
    borderRadius: "6px",
    transition: "background 0.2s",
    flexShrink: 0,
  },
};

export default TaskItem;