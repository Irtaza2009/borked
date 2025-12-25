import React from "react";
import HourglassLoader from "./HourglassLoader";
import { BACKEND_URL } from "../config";

const Home = ({ user }) => {
  const login = () => {
    window.location.href = `${BACKEND_URL}/auth/slack`;
  };

  return (
    <div className="home-content" aria-labelledby="home-heading">
      <h2 id="home-heading" className="home-title">
        Borked
      </h2>

      <div className="home-text" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
        {/** <h3 style={{ margin: 0, letterSpacing: "0.12em", textTransform: "uppercase" }}>A Bad UI Competition</h3> **/}
        {!user && (
          <button type="button" onClick={login}>Login with Slack</button>
        )}
      </div>

      {/**  <p className="home-text">A <b><i>bad</i> UI competition</b>! The <del>best</del> <b>worst</b> project gets a <a href="https://en.wikipedia.org/wiki/Useless_machine">Useless Box</a>!</p> **/}
      <p className="home-text">more info goes here blah blah blah...</p>

      <HourglassLoader />
    </div>
  );
};

export default Home;
