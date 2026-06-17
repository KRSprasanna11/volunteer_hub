import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("volunteer");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state

  const handleRegister = async () => {
    try {
      await axios.post("http://https://volunteer-hub-jp64.onrender.com/api/auth/register", {
        name,
        email,
        password,
        role: role.toUpperCase(),
      });

      alert("Registered Successfully ✅");

      // ==================================================
      // 🔐 AUTO LOGIN AFTER REGISTER (NEW)
      // ==================================================
      const loginRes = await axios.post(
        "http://https://volunteer-hub-jp64.onrender.com/api/auth/login",
        { email, password }
      );

      const user = loginRes.data.user
        ? loginRes.data.user
        : loginRes.data;

      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to document verification page
      navigate("/document-verification");

    } catch (err) {
      console.error("REGISTER ERROR 👉", err.response?.data);
      alert(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-glass">
        {/* 🖼️ Branding touch */}
        <div className="logo-circle">VH</div>

        <h2>Create Account 🚀</h2>

        <div className="field">
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <label>Full Name</label>
        </div>

        <div className="field">
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="field">
          <input
            type={showPassword ? "text" : "password"}
            required
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

        <div className="role-box">
          {["volunteer", "organizer"].map((r) => (
            <span
              key={r}
              className={role === r ? "role active" : "role"}
              onClick={() => setRole(r)}
            >
              {r}
            </span>
          ))}
        </div>

        <button className="primary-btn" onClick={handleRegister}>
          Register →
        </button>

        <p className="switch">
          Already have an account?
          <span onClick={() => navigate("/")}> Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
