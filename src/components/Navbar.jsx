// src/components/Navbar.jsx

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // -------------------------------------------------------------------------
  // Handle logout — sign out then redirect to login page
  // -------------------------------------------------------------------------
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* App name / logo */}
        <span style={styles.logo}>📚 StudyTracker</span>

        {/* Right side — user email + logout button */}
        <div style={styles.rightSection}>
          {/* Show logged-in user's email */}
          {user && (
            <span style={styles.email}>
              {user.email}
            </span>
          )}

          {/* Logout button */}
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

// ---------------------------------------------------------------------------
// Inline styles
// ---------------------------------------------------------------------------
const styles = {
  navbar: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100, // stays on top when scrolling
  },
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "0.9rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#4f46e5",
    letterSpacing: "-0.5px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  email: {
    fontSize: "0.85rem",
    color: "#718096",
    // Hide email on very small screens
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "180px",
  },
  logoutButton: {
    padding: "0.45rem 1rem",
    backgroundColor: "transparent",
    color: "#e53e3e",
    border: "1px solid #e53e3e",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Navbar;