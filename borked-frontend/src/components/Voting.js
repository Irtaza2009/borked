import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Voting.css";
import SwordLoader from "./SwordLoader";
import { API_BASE_URL } from "../config";

const defaultAvatar =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAM1BMVEX4+PiGhoaUlJTq6uq/v7+NjY3x8fHb29uxsbHNzc2jo6PGxsbi4uKbm5u3t7fU1NSpqalb9J8wAAAERklEQVR4nO2cDZarIAyFq6go/tT9r/bJME61VgsSknBevhXcQAIkBB4PQRAEQRAEQRAEQRAEQRAEQRAEGFRXtaasi4W6NHP1HKgVBaD6+Uf5nnruFLUyH5rKHMWvjOxt0BfqHa2m1njBd/mWsqPWeYKffIvh6EjN5Cv/x5HYmaDLEP2LHz2pFe8JGn5HRa15g/L2/i0jGzdSge6zUjKxYPiw7XpawOJ8cV//crxgYIGK0M/Bgrv+v0IdB02k/sWChtSAOVZ/UcyU+qt4/UXR0+lXEPqLgi6QowPAMVLpB3EgC9GxKG4H2FLTrEQtlP4lPaDQDxTBDortDHACSKYAdAIoogBsCXLgL0RAe8BKja1fw+ovCux6F2gIWyZkA4A9CN2HBmj92Ee6Ht4A3FM1QCLzDm5iAx4CS26Jqb+B118UmJsx+C5gwYziZwoDMO89gA9CDsxl6EY1/TuYezH4QcKCmROIAWLA/25A9qtQkn0AMy3uUhiAuRMnOUpgZsWwRaFfUFMysLruC9yk+NbV/DUG1YAE6yhuXSVBRoNb2WrggwBVf4IgwL5tBd/KsBvpwH0I/YIAeB3Cv6IBXocIuklBwxh3F3OATgFJLyzgFKDWRf8AnAKifmqwGjvJRf0DrlmCru0M6J6GsJsdJI6pHMgS3/NH3bcY0/X6C3HfZfSplLDlzxFZ42LQhB9lAQP9URaw0B9hAbn/rzxvrUU1o2c0d3rYqfvW94Q9wrJMtF3rR7qgSSgZPkhs/GO5rrgNv0N5Xp3xe8b3h4cJ9cRXvkV145V80/N0nh2qP0kTTMV78Dc0upp3M1HOvc5g7N9Qg9Zd99RDNgMvCIIgCAIlSnfV1M6mLD+kZ3VZGtNOVafJn6EfaYZumgNyytFMfA53Q9/erFGPc089GUNvIsvTtSEzotET1BVTi1/ianQL2ixR49oANvZbSqzPq5rqMm2PsgHhDzGVYvA3JK4Z+X+jxdIEDPkWk2ZhHZDkWxLMQnj9nJcJVdrQ/UAJeX+mky2clyZATQK297yAucUJ/QIPEohfxMiG3xEbCfe+wIMk7js9SvdZibkPTPBy/g633YjY/V/cexvRkLv/i/nGeqpINq8zwkM59gc/aEK3ZW76Qy3gpz/MAohuSngCfmVkFb8vRl8L2Kz/73j2+CZ5LAyD156c5K0wFB71O7gPCFNQf1+KWC5AL74GMuMAcHw52CX5dweWy/SA5w6253I/Y+9AlgsnSvLWH57zUgWjFOaK03eLrLewLWdxnEEEO06+Sc5mAs5enmUzASdRkOS/lFR8ioJMliDHhynIZA9YOe4FSX6dSscxtckohC2Hv3AyOIbueQ/jzDzoeKTLzIMO/whktgZZ9tlxRseIlf1xIrsQeK9yMS0mXrEPAmo1d9jmxgk+8k7PNoqzOomubMuMTO5Tw9g+p86inPLO9jyX4Sq6X0fFAAqcAf8AkU5HyWczqdIAAAAASUVORK5CYII=";

const CATEGORY_LABELS = {
  // bad ui design competition
  creativity: "Chaos",
  fun: "Borked Design",
  accessibility: "Unusable",  
};

export default function Voting() {
  const [pair, setPair] = useState([]);
  const [token, setToken] = useState(null);
  const [selectedVotes, setSelectedVotes] = useState({
    fun: null,
    creativity: null,
    accessibility: null,
  });
  const [visitedSites, setVisitedSites] = useState({});
  const [startTime, setStartTime] = useState(Date.now());
  const [voteStatus, setVoteStatus] = useState("idle");
  const [voteCount, setVoteCount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchPair = async () => {
    setErrorMessage(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/voting-pair`, {
        withCredentials: true,
      });
      setPair(res.data.pair);
      setToken(res.data.token);
      setSelectedVotes({ fun: null, creativity: null, accessibility: null });
      setVisitedSites({});
      setStartTime(Date.now());
      setVoteStatus("idle");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again later.";
      if (
        msg === "No new pairs left to vote on!" ||
        msg === "Not enough submissions to vote."
      ) {
        setErrorMessage(msg);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
      setPair([]);
      setToken(null);
    }
  };

  useEffect(() => {
    fetchPair();
    axios
      .get(`${API_BASE_URL}/user-votes`, {
        withCredentials: true,
      })
      .then((res) => setVoteCount(res.data.count))
      .catch(() => setVoteCount(0));
  }, []);

  useEffect(() => {
    if (voteStatus === "success") {
      const timeout = setTimeout(() => setVoteStatus("idle"), 3200);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [voteStatus]);

  const handleSelect = (category, winnerId) => {
    const opponent = pair.find((p) => p._id !== winnerId);
    if (!opponent) return;
    const loserId = opponent._id;
    setSelectedVotes((prev) => ({
      ...prev,
      [category]: { winnerId, loserId },
    }));
  };

  const confirmVote = async () => {
    setVoteStatus("loading");
    try {
      await axios.post(
        `${API_BASE_URL}/vote`,
        {
          token,
          funWinnerId: selectedVotes.fun?.winnerId,
          funLoserId: selectedVotes.fun?.loserId,
          creativityWinnerId: selectedVotes.creativity?.winnerId,
          creativityLoserId: selectedVotes.creativity?.loserId,
          accessibilityWinnerId: selectedVotes.accessibility?.winnerId,
          accessibilityLoserId: selectedVotes.accessibility?.loserId,
          startTime,
        },
        { withCredentials: true }
      );
      await fetchPair();
      setVoteStatus("success");
      setVoteCount((prev) => (prev === null ? 1 : prev + 1));
    } catch (error) {
      if (
        error.response?.data?.message &&
        error.response.data.message.toLowerCase().includes("token")
      ) {
        alert(
          "Your voting session has expired or is invalid. Please reload the page to get a new voting pair."
        );
        window.location.reload();
      } else {
        setVoteStatus("idle");
      }
    }
  };

  const isSelected = (category, id) => selectedVotes[category]?.winnerId === id;
  const allCategoriesVoted =
    selectedVotes.fun &&
    selectedVotes.creativity &&
    selectedVotes.accessibility;
  const bothSitesVisited = pair.every((s) => visitedSites[s._id]);

  if (voteCount >= 10) {
    return (
      <div className="voting-container">
        <div className="voting-header">
          <h2 className="voting-title">You've used all 10 of your votes 🎉</h2>
          <p className="voting-subtitle">Thanks for participating!</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="voting-container">
        <div className="voting-header">
          <p className="voting-message error">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (pair.length < 2) {
    return (
      <div className="voting-container">
        <SwordLoader />
        <p className="cottage-text">Loading votes...</p>
      </div>
    );
  }

  return (
    <div className="voting-container" role="region" aria-label="Voting panel">
      <div className="voting-header">
        <h2 className="voting-title">Vote for your Favourite Submission</h2>
        {voteCount !== null && (
          <p className="voting-subtitle">
            You have <span>{Math.max(10 - voteCount, 0)}</span> votes left.
          </p>
        )}
        {voteStatus === "success" && (
          <p className="voting-message success" role="status">
            Vote recorded! Fetching a new pair.
          </p>
        )}
      </div>

      <div className="voting-pair">
        {pair.map((submission) => (
          <article key={submission._id} className="voting-card">
            <figure className="voting-art">
              <img
                src={submission.imageUrl}
                alt={`${submission.projectName} preview`}
                className="voting-image"
              />
            </figure>

            <div className="voting-card-body">
              <h3 className="voting-project">{submission.projectName}</h3>

              <div className="voting-author">
                <img
                  src={submission.user.avatar}
                  alt={`${submission.user.name}'s avatar`}
                  className="voting-avatar"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
                <span>{submission.user.name}</span>
              </div>

              {submission.description && (
                <p className="voting-description">
                  <span className="voting-description-label">Description:</span>{" "}
                  {submission.description}
                </p>
              )}

              <div className="voting-links">
                <a
                  href={submission.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="voting-link primary"
                  onClick={() =>
                    setVisitedSites((prev) => ({
                      ...prev,
                      [submission._id]: true,
                    }))
                  }
                >
                  Visit
                </a>

                {submission.sourceUrl && (
                  <a
                    href={submission.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="voting-link secondary"
                  >
                    View Source
                  </a>
                )}
              </div>

              <div className="voting-categories">
                <p className="voting-categories-label">Cast your vote for:</p>
                {["creativity", "fun", "accessibility"].map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => handleSelect(category, submission._id)}
                    disabled={!bothSitesVisited}
                    className={`voting-choice ${
                      isSelected(category, submission._id) ? "selected" : ""
                    }`}
                  >
                    {CATEGORY_LABELS[category]}
                  </button>
                ))}
              </div>

              {!bothSitesVisited && (
                <p className="voting-visit-warning">
                  ⚠️ Visit both submissions before voting.
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="voting-footer">
        <button
          type="button"
          onClick={confirmVote}
          className="voting-confirm"
          disabled={!allCategoriesVoted || voteStatus === "loading"}
        >
          {voteStatus === "loading" ? "Submitting..." : "Confirm Vote"}
        </button>

        {!allCategoriesVoted && (
          <p className="voting-warning" role="alert">
            Please vote in all categories before confirming.
          </p>
        )}
      </div>
    </div>
  );
  }

