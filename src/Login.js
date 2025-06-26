import React, { useState } from "react";
import "./App.css";

function Login({ onLogin, dark }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const getUsers = () => {
    return JSON.parse(localStorage.getItem("users") || "{}");
  };

  const saveUser = (uname, pass) => {
    const users = getUsers();
    users[uname] = {
      password: pass,
      name: uname,
      email: "",
      image: "",
    };
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = getUsers();

    if (isRegistering) {
      if (users[username]) {
        alert("Username already exists!");
      } else {
        saveUser(username, password);
        alert("Registration successful! Please log in.");
        setIsRegistering(false);
      }
    } else {
      if (users[username] && users[username].password === password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", username);
        onLogin();
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className={`login-page ${dark ? "dark" : "light"}`}>
      <h1>{isRegistering ? "Register for FocusFlow" : "Login to FocusFlow"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <div className="auth-toggle">
        {isRegistering ? (
          <>
            Already have an account?{" "}
            <button onClick={() => setIsRegistering(false)}>Login</button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button onClick={() => setIsRegistering(true)}>Register</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
