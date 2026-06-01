import React, { useState } from "react";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirm) {
      alert("Password mismatch ❌");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup success 🔥");

      // 👉 redirect to login
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="form_container">
      <h2>Signup</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;