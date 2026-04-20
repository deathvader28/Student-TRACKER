// src/pages/Signup.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  // -------------------------------------------------------------------------
  // Controlled form state
  // -------------------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // -------------------------------------------------------------------------
  // Handle form submission
  // -------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError("");        // clear previous errors

    // Basic validation
    if (!email || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);
      await signup(email, password);
      navigate("/dashboard"); // redirect to dashboard on success
    } catch (err) {
      // Handle common Firebase auth errors with friendly messages
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <h2 style={styles.title}>Create Account 🚀</h2>
        <p style={styles.subtitle}>Start tracking your study tasks today</p>

        {/* Error message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              required
            />
          </div>

          {/* Password input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={styles.input}
              required
            />
          </div>

          {/* Confirm Password input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              style={styles.input}
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Link to Login */}
        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Inline styles — consistent with Login.jsx
// ---------------------------------------------------------------------------
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    margin: "0 0 0.25rem 0",
    fontSize: "1.8rem",
    color: "#1a202c",
  },
  subtitle: {
    margin: "0 0 1.5rem 0",
    color: "#718096",
    fontSize: "0.95rem",
  },
  error: {
    backgroundColor: "#fff5f5",
    color: "#c53030",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    fontSize: "0.9rem",
    border: "1px solid #fed7d7",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#4a5568",
  },
  input: {
    padding: "0.65rem 0.9rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.2s",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.75rem",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  switchText: {
    marginTop: "1.25rem",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#718096",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Signup;