import React, { useState, useEffect } from "react";
import "./UselessToggle.css";

export default function UselessToggle({ onComplete }) {
  const [isActive, setIsActive] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [stickmanClass, setStickmanClass] = useState("");
  const [stickmanLeft, setStickmanLeft] = useState(-100);
  const [turnOffCount, setTurnOffCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [holeCreated, setHoleCreated] = useState(false);
  const [shouldCompleteOnToggle, setShouldCompleteOnToggle] = useState(false);

  // Check if user has visited before
  const hasVisited = localStorage.getItem("borked_visited") === "true";

  // Show button immediately on return visits
  useEffect(() => {
    if (hasVisited) {
      setShowButton(true);
    }
  }, [hasVisited]);

  const handleToggleClick = () => {
    if (!isActive && !isOn) {
      setIsActive(true);
      setIsOn(true);
      // Don't hide button on return visits
      if (!hasVisited) {
        setShowButton(false);
      }

      // If hole exists and should complete on toggle, do animations and complete
      if (holeCreated && shouldCompleteOnToggle) {
        // Start loading progress
        setTimeout(() => {
          startLoadingProgress();
        }, 300);

        // Activate stickman after short delay
        setTimeout(() => {
          activateStickmanForFall();
        }, 500);
        return;
      }

      // Normal first visit flow
      // Start loading progress
      setTimeout(() => {
        startLoadingProgress();
      }, 300);

      // Activate stickman after short delay
      setTimeout(() => {
        activateStickman();
      }, 500);
    }
  };

  const startLoadingProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setLoadingProgress(Math.floor(progress));
    }, 150);
  };

  const activateStickman = () => {
    setStickmanClass("walking");
    setStickmanLeft(170);

    setTimeout(() => {
      turnOff();
    }, 2000);
  };

  const activateStickmanForFall = () => {
    setStickmanClass("walking");
    setStickmanLeft(170);

    setTimeout(() => {
      turnOffAndFall();
    }, 2000);
  };

  const turnOff = () => {
    setStickmanClass("reaching");

    setTimeout(() => {
      setIsOn(false);
      setTurnOffCount((prev) => prev + 1);

      setTimeout(() => {
        setStickmanClass("walking");
        setStickmanLeft(-100);

        setTimeout(() => {
          setStickmanClass("");
          setIsActive(false);

          // first visit only, show button after first toggle
          if (!hasVisited && turnOffCount === 0) {
            setShowButton(true);
          }
        }, 2000);
      }, 500);
    }, 500);
  };

  const turnOffAndFall = () => {
    setStickmanClass("falling");

    // Complete after stickman falls through hole
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  const handleButtonClick = () => {
    // create the hole
    setHoleCreated(true);
    setShouldCompleteOnToggle(true);
  };

  // user click button for fall animation

  return (
    <div className="useless-toggle-overlay">
      <div className="toggle-content">
        <h1 className="toggle-heading">Borked</h1>
        <p className="toggle-subtitle">
          {!isOn && loadingProgress === 0
            ? "Turn on the toggle to enter"
            : isOn && loadingProgress < 100
            ? `Loading site... ${loadingProgress}%`
            : ""}
        </p>

        <div className="toggle-area">
          {holeCreated && <div className="trap-hole" />}

          <div className="toggle-container">
            <div
              className={`toggle ${isOn ? "on" : ""}`}
              onClick={handleToggleClick}
            >
              <div className="toggle-switch" />
            </div>
          </div>

          <div
            className={`stickman ${stickmanClass}`}
            style={{ left: `${stickmanLeft}px` }}
          >
            <div className="head" />
            <div className="body" />
            <div className="arm left-arm" />
            <div className="arm right-arm" />
            <div className="leg left-leg" />
            <div className="leg right-leg" />
          </div>
        </div>

        {showButton && (
          <button
            type="button"
            className="trap-button"
            onClick={handleButtonClick}
          >
            Press me
          </button>
        )}

        <div className="counter">Times turned off: {turnOffCount}</div>
      </div>
      <footer className="toggle-footer">
        <b>
            Made with{" "}❤️ by{" "} 
          <a
            href="https://hackclub.slack.com/team/U079EQY9X1D"
            target="_blank"
            rel="noopener noreferrer"
          >
            Irtaza
          </a>
          {" "} —{" "}
          <a
            href="https://github.com/Irtaza2009"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </b>
      </footer>
    </div>
  );
}
