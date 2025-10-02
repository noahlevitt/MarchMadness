import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSession } from "../../contexts/UserSessionContext";
import "./Login.css";

import { queryBackend, backendLogin, backendSignUp } from '../../utils/api';

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const navigate = useNavigate();
  const { login, isLoggedIn } = useUserSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      alert("You are already logged in.");
      return;
    }

    try {
      setEmail(email.trim())
      const result = await backendLogin(email, password);
      const parts = result.trim().split(/\s+/);

      if (parts.length === 5 && parts[2] === email) {
        const userId = parseFloat(parts[0])
        const balance = parseFloat(parts[4])

        login(email, userId, balance);
        navigate("/");
      } else {
        alert("Login failed. Please check your email and password.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong during login.");
    }
  };

  const handleCreateAccount = async () => {
    try {
      await backendSignUp(email, password);
      alert("Account created! You can now sign in.");
    } catch (error) {
      console.error("Account creation failed:", error);
      alert("Failed to create account.");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>Basketball Betting Login</h2>
        <input 
          type="text"
          placeholder="example@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type={showPassword ? "text" : "password"} 
          placeholder="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="login-show-password">
          <input 
            type="checkbox" 
            id="showPassword"
            checked={showPassword} 
            onChange={() => setShowPassword(!showPassword)} 
          />
          <label htmlFor="showPassword">Show Password</label>
        </div>  
        <button type="submit" disabled={!email.trim() || !password.trim()}>Sign in</button>
        <button onClick={handleCreateAccount} type="button">Create Account</button>
        <button type="forgot-button" onClick={() => alert('Forgot password is not functional yet.')}>Forgot Password?</button>
      </form>
    </div>
  );
};

export default Login;
