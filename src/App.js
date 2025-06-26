import React, { useState, useEffect } from "react";
import Login from "./Login";
import "./App.css";
import UserProfile from "./UserProfile";

function App() {
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem("currentUser") || ""
  );
  const [showProfile, setShowProfile] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(
    () => Number(localStorage.getItem("sessions")) || 0
  );
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("history");
    return stored ? JSON.parse(stored) : [];
  });
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      const timestamp = new Date().toLocaleString();
      const updatedSessions = sessionsCompleted + 1;
      const updatedHistory = [...history, timestamp];
      setSessionsCompleted(updatedSessions);
      setHistory(updatedHistory);
      localStorage.setItem("sessions", updatedSessions);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const handleCustomTimeChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 120) {
      setCustomMinutes(value);
      setTimeLeft(value * 60);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("history");
    localStorage.setItem("sessions", 0);
    setHistory([]);
    setSessionsCompleted(0);
  };

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => {
          setIsLoggedIn(true);
          setCurrentUser(localStorage.getItem("currentUser"));
        }}
        dark={darkMode}
      />
    );
  }

  const userImage =
    JSON.parse(localStorage.getItem("users") || "{}")[currentUser]?.image ||
    "https://i.pravatar.cc/100";

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      {/* Profile Icon */}
      <div className="profile-icon" onClick={() => setShowProfile(true)}>
        <img src={userImage} alt="Profile" />
      </div>

      <h1>FocusFlow</h1>

      <div className="top-controls">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            setIsLoggedIn(false);
          }}
        >
          🔓 Logout
        </button>
      </div>

      <div className="custom-time">
        <label>Set Timer (min):</label>
        <input
          type="number"
          value={customMinutes}
          onChange={handleCustomTimeChange}
          min="1"
          max="120"
        />
      </div>

      <div className="timer-display animate-pulse">{formatTime(timeLeft)}</div>

      <div className="buttons">
        <button className="start" onClick={toggleTimer}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="reset" onClick={resetTimer}>
          Reset
        </button>
      </div>

      <div className="stats">
        🍅 Sessions Completed: <strong>{sessionsCompleted}</strong>
      </div>

      <div className="history">
        <h3>📅 Session History</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
        {history.length > 0 && (
          <button className="clear" onClick={clearHistory}>
            Clear History
          </button>
        )}
      </div>

      {showProfile && (
        <UserProfile
          currentUser={currentUser}
          onLogout={() => {
            setIsLoggedIn(false);
            setShowProfile(false);
          }}
          onClose={() => setShowProfile(false)} 
        />
      )}
    </div>
  );
}

export default App;
