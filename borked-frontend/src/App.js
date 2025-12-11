import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login";
import SubmissionForm from "./components/SubmissionForm";
import Voting from "./components/Voting";
import Submitted from "./components/Submitted";
import { LeaderboardManager } from "./components/Leaderboard";
import HourglassLoader from "./components/HourglassLoader";
import Gallery from "./components/Gallery";
import Home from "./components/Home";
import UselessToggle from "./components/UselessToggle";
import { API_BASE_URL, BACKEND_URL } from "./config";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [toggleCompleted, setToggleCompleted] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/me`, {
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
        `${BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      )
      .finally(() => {
        window.location.reload();
      });
  };

  const renderLoading = () => (
    <>
      <HourglassLoader />
      <p className="cottage-text">Loading...</p>
    </>
  );

  const renderActiveContent = () => {
    switch (activeTab) {
      case "home":
        return <Home user={user} />;
      case "gallery":
        if (checking) return renderLoading();
        if (error) return <p className="cottage-text error">{error}</p>;
        return <Gallery />;
      case "voting":
        if (checking) return renderLoading();
        if (error) return <p className="cottage-text error">{error}</p>;
        if (!user) return <Login />;
        return user.hasSubmitted ? (
          <Voting />
        ) : (
          <Submitted lockedType="submitFirst" />
        );
      case "submit":
      default:
        if (checking) return renderLoading();
        if (error) return <p className="cottage-text error">{error}</p>;
        if (!user) return <Login />;
        return !user.hasSubmitted ? (
          <SubmissionForm user={user} />
        ) : (
          <Submitted lockedType="submitSuccess" />
        );
    }
  };

  const renderMainApp = () => (
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
              className={`app-tab ${activeTab === "voting" ? "active" : ""}`}
              onClick={() => setActiveTab("voting")}
              aria-pressed={activeTab === "voting"}
            >
              Voting
            </button>
          )}
          <button
            type="button"
            className={`app-tab ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
            aria-pressed={activeTab === "gallery"}
          >
            Gallery
          </button>
        </div>

        <div className="parchment-sheet">{renderActiveContent()}</div>
      </div>
      <LeaderboardManager />
      <footer className="footer-signout">
        <span onClick={handleSignOut}>Sign out</span>
      </footer>
    </div>
  );

  return (
    <>
      {!toggleCompleted && (
        <UselessToggle onComplete={() => setToggleCompleted(true)} />
      )}
      {toggleCompleted && renderMainApp()}
    </>
  );
}

export default App;

/* To Do:
- Export data
*/
