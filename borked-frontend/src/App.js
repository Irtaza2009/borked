import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login";
import SubmissionForm from "./components/SubmissionForm";
// import Voting from "./components/Voting";
import Submitted from "./components/Submitted";
import { LeaderboardManager } from "./components/Leaderboard";
import SwordLoader from "./components/SwordLoader";
import Gallery from "./components/Gallery";
import Home from "./components/Home";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    axios
      .get(//"https://backend.borked.irtaza.xyz/api/me",
        "http://localhost:5000/api/me", // for local
      {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setUser(null);
        } else {
          console.error("Error fetching user:", err);
          setError("Something went wrong. Please try again later.");
        }
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  // Sign out handler
  const handleSignOut = () => {
    axios
      .post(
        "https://backend.borked.irtaza.xyz/auth/logout",
        {},
        { withCredentials: true }
      )
      .finally(() => {
        window.location.reload();
      });
  };



  return (
    <div className="App">
      <h1 className="app-heading" aria-label="Borked title">
        Borked
      </h1>
      <div className="parchment-frame">
        <div className="app-tabs" role="tablist" aria-label="Main sections">
          <button
            type="button"
            className={`app-tab ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
            aria-pressed={activeTab === "home"}
          >
            Home
          </button>
          {user && (
            <button
              type="button"
              className={`app-tab ${activeTab === "submit" ? "active" : ""}`}
              onClick={() => setActiveTab("submit")}
              aria-pressed={activeTab === "submit"}
            >
              Submit
            </button>
          )}
          {user && (
            <button
              type="button"
              className={`app-tab ${activeTab === "gallery" ? "active" : ""}`}
              onClick={() => setActiveTab("gallery")}
              aria-pressed={activeTab === "gallery"}
            >
              Gallery
            </button>
          )}
        </div>

        <div className="parchment-sheet">
          {activeTab === "home" ? (
            <Home />
          ) : activeTab === "gallery" ? (
            <Gallery />
          ) : checking ? (
            <>
              <SwordLoader />
              <p className="cottage-text">Loading...</p>
            </>
          ) : error ? (
            <p className="cottage-text error">{error}</p>
          ) : !user ? (
            <Login />
          ) : !user.hasSubmitted ? (
            <SubmissionForm user={user} />
            //<Submitted lockedType="submission" />
          ) : (
            //<Voting user={user} />
            <Submitted lockedType="voting" />
          )}
        </div>
      </div>
      <LeaderboardManager />
      <footer className="footer-signout">
        <span onClick={handleSignOut}>Sign out</span>
      </footer>
    </div>
  );
}

export default App;

/* To Do:
- Export data
*/
