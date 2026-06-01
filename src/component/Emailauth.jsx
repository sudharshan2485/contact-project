import React, { useState } from "react";
import "./Emailauth.css";
import gle from "../image/google.png"
import { auth } from "../Firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

function Emailauth() {
  const [active, setActive] = useState(false);

  // 🔥 LOGIN
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 🔥 SIGNUP
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ================= LOGIN =================
  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      console.log(res);

      alert("Login Success 🔥");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  // ================= SIGNUP =================
  const signup = async () => {
    if (signupPassword !== confirmPassword) {
      alert("Password mismatch ❌");
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );

      alert("Signup Success 🔥");

      setActive(false);
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  // ================= GOOGLE LOGIN =================
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const res = await signInWithPopup(auth, provider);

      console.log(res);

      alert("Google Login Success 🔥");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  // ================= FORGOT PASSWORD =================
  const forgotPassword = async () => {
    if (!loginEmail) {
      alert("Enter your email first 😅");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, loginEmail);

      alert("Reset Link Sent 📩");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <div className="main">

      <div className={`container ${active ? "active" : ""}`}>

        {/* ================= SIGN UP ================= */}

        <div className="form-container sign-up">
          <form>

            <h1>Create Account</h1>

            <div className="social-icons">

              <button
                type="button"
                className="icon"
                onClick={googleLogin}
              >
                <img src={gle} className="gle-img" alt="" />
                <h4>Continue with Google</h4>
              </button>
{/* 
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>

              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>

              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a> */}

            </div>

            <span>or use your email for registration</span>

            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="button" onClick={signup} >
              Sign Up
            </button>
            

          </form>
        </div>

        {/* ================= LOGIN ================= */}

        <div className="form-container sign-in">
          <form>

            <h1>Sign In</h1>


            {/* <span>or use your email password</span> */}

            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <p
              onClick={forgotPassword}
              style={{
                cursor: "pointer",
                marginTop: "10px",
                fontSize: "13px",
              }}
            >
              Forgot Your Password?
            </p>
            <div className="divider">
              <span>OR</span>
            </div>
            <div className="social-icons">

              <button
                type="button"
                className="icon"
                onClick={googleLogin}
              >
                <img src={gle} className="gle-img" alt="" />
                <h4>Continue with Google</h4>
                {/* <i className="fa-brands fa-google-plus-g"></i> */}
              </button>
{/* 
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>

              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>

              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a> */}

            </div>

            <button type="button" onClick={login}>
              Sign In
            </button>

          </form>
        </div>

        {/* ================= TOGGLE ================= */}

        <div className="toggle-container">

          <div className="toggle">

            <div className="toggle-panel toggle-left">

              <h1>Welcome Back!</h1>

              <p>
                Enter your personal details to use all site features
              </p>

              <button
                className="hidden"
                onClick={() => setActive(false)}
              >
                Sign In
              </button>

            </div>

            <div className="toggle-panel toggle-right">

              <h1>Hello, Friend!</h1>

              <p>
                Register with your personal details to use all site features
              </p>

              <button
                className="hidden"
                onClick={() => setActive(true)}
              >
                Sign Up
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Emailauth;