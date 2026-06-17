import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const handleLogin = async () => {
    setError("");

    try {
      const res = await axios.post(
        "http://https://volunteer-hub-jp64.onrender.com/api/auth/login",
        { email, password }
      );

      // ✅ FIX: Ensure correct user object is stored
      const user = res.data.user ? res.data.user : res.data;

      // ✅ Store correct user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // ==================================================
      // 🔐 DOCUMENT VERIFICATION CHECK (ONLY FOR VOL/ORG)
      // ==================================================
      if (user.role !== "ADMIN") {
        try {
          const statusRes = await axios.get(
            "http://https://volunteer-hub-jp64.onrender.com/api/documents/status",
            {
              params: {
                userId: user.id,
                role: user.role,
              },
            }
          );

          const status = statusRes.data?.status;

          // If not approved → go to verification page
          if (status !== "APPROVED") {
            navigate("/document-verification");
            return;
          }
        } catch (err) {
          // No document uploaded yet
          navigate("/document-verification");
          return;
        }
      }
      // ==================================================

      // ✅ VOLUNTEER PROFILE CHECK
      if (user.role === "VOLUNTEER" && !user.profileCompleted) {
        setShowProfilePopup(true);
        return; // 🔥 STOP navigation
      }

      // ✅ ROLE-BASED NAVIGATION
      if (user.role === "VOLUNTEER") {
        navigate("/volunteer");
      } else if (user.role === "ORGANIZER") {
        navigate("/organizer");
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      }

    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  const goToProfile = () => {
    setShowProfilePopup(false);
    navigate("/volunteer/profile");
  };

  // 🔥🔥🔥 FORCE FULL LOGOUT RESET (HARD RELOAD)
  const forceLogout = () => {
    setShowProfilePopup(false);
    localStorage.removeItem("user");
    window.location.replace("/login"); // 🔥 HARD RESET
  };

  return (
    <div className="auth-bg">

      {/* ================= PROFILE COMPLETION POPUP ================= */}
      {showProfilePopup && (
        <div className="profile-popup">
          <div className="popup-card">
            <h3>Complete Your Profile</h3>
            <p>You must update your profile before continuing.</p>

            <button onClick={goToProfile} className="primary-btn">
              Go to Profile
            </button>

            <button onClick={forceLogout} className="danger-btn">
              Skip & Logout
            </button>
          </div>
        </div>
      )}

      {/* ================= LOGIN FORM ================= */}
      <div className="auth-glass">
        <div className="logo-circle">VH</div>

        <h2>Welcome Back</h2>

        <div className="field">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="field">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>

          <span
            className="toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="primary-btn" onClick={handleLogin}>
          Login →
        </button>

        <p className="switch-text">
          Don’t have an account?
          <span onClick={() => navigate("/register")}> Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
