import React from "react";
import HourglassLoader from "./HourglassLoader";

const Home = () => (
  <div className="home-content" aria-labelledby="home-heading">
    <h2 id="home-heading" className="home-title">
      Borked
    </h2>
    <p className="home-text">A <b><i>bad</i> UI competition</b>! The <del>best</del> <b>worst</b> project gets a <a href="https://en.wikipedia.org/wiki/Useless_machine">Useless Box</a>!</p>
    <p className="home-text">more info goes here blah blah blah...</p>
    <HourglassLoader />
  </div>
);

export default Home;
