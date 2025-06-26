import React, { useState } from "react";
import "./App.css";

function UserProfile({ currentUser, onLogout, onClose }) {
  const [userData, setUserData] = useState(() => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    return users[currentUser] || {};
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () =>
      setUserData((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(e.target.files[0]);
  };

  const saveChanges = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[currentUser] = userData;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Profile updated!");
  };

  const deleteAccount = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    delete users[currentUser];
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    onLogout();
  };

  return (
    <div className="profile-modal">
      {/* CLOSE BUTTON */}
      <button className="profile-close-btn" onClick={onClose}>
        ✖
      </button>

      <h2>Your Profile</h2>

      <label className="profile-pic">
        <img
          src={userData.image || "https://i.pravatar.cc/100"}
          alt="profile"
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={userData.name || ""}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={userData.email || ""}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={userData.password || ""}
        onChange={handleChange}
      />

      <div className="profile-actions">
        <button onClick={saveChanges}>Save</button>
        <button onClick={deleteAccount} className="delete">
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
