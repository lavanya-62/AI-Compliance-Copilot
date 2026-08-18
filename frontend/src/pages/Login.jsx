import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous message
    setMessage("");

    // Validation
    if (!email.trim() || !password.trim()) {
      setMessage("⚠️ Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      // Login failed
      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      // Check user data
      if (!data.user) {
        throw new Error(
          "User information was not received from the server."
        );
      }

      if (!data.user.id) {
        throw new Error(
          "User ID was not received from the server."
        );
      }

      // ==========================================
      // SAVE USER INFORMATION
      // ==========================================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "userId",
        String(data.user.id)
      );

      console.log(
        "Logged in user:",
        data.user
      );

      console.log(
        "Saved userId:",
        data.user.id
      );

      // Success message
      setMessage("✅ Login successful!");

      // ==========================================
      // GO TO DASHBOARD
      // ==========================================

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        `❌ ${error.message}`
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* ICON */}

        <div className="login-icon">
          🛡️
        </div>


        {/* TITLE */}

        <h1>
          AI Compliance Copilot
        </h1>

        <p className="login-subtitle">
          Compliance made simple for MSMEs
        </p>


        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
            disabled={loading}
          />


          {/* PASSWORD */}

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
            disabled={loading}
          />


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* MESSAGE */}

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}


        {/* REGISTER */}

        <p className="register-text">
          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;