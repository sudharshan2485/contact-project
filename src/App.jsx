import React, {
  useEffect,
  useState,
} from "react";

import AddContact from "./component/Addcontact";
import ContactList from "./component/ContactList";
import EmailAuth from "./component/Emailauth";
import Signup from "./component/Signup";
import ViewContact from "./component/ViewContact";

import { auth } from "./Firebase";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import "./App.css";

import "@fortawesome/fontawesome-free/css/all.min.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

function AppContent() {

  const [user, setUser] =
    useState(null);

  const navigate =
    useNavigate();

  const location =
    useLocation();

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser);

          // LOGIN ILLANA
          if (
            !currentUser &&
            location.pathname !==
              "/login" &&
            location.pathname !==
              "/signup"
          ) {

            navigate("/login");

          }

          // LOGIN IRUNTHA
          if (
            currentUser &&
            (location.pathname ===
              "/login" ||
              location.pathname ===
                "/signup")
          ) {

            navigate("/");

          }

        }
      );

    return () => unsubscribe();

  }, [
    navigate,
    location.pathname,
  ]);

  // LOGOUT

  const logout = async () => {

    await signOut(auth);

    navigate("/login");

  };

  return (

    <div>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={
            user ? (
              <ContactList
                user={user}
                logout={logout}
              />
            ) : (
              <EmailAuth />
            )
          }
        />

        {/* CREATE CONTACT */}

        <Route
          path="/create"
          element={
            user ? (
              <AddContact
                user={user}
                logout={logout}
              />
            ) : (
              <EmailAuth />
            )
          }
        />

        {/* VIEW CONTACT */}

        <Route
          path="/view"
          element={
            user ? (
              <ViewContact
                user={user}
                logout={logout}
              />
            ) : (
              <EmailAuth />
            )
          }
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<EmailAuth />}
        />

        {/* SIGNUP */}

        <Route
          path="/signup"
          element={<Signup />}
        />

      </Routes>

    </div>

  );
}

function App() {

  return (

    <Router>

      <AppContent />

    </Router>

  );
}

export default App;