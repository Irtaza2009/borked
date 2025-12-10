import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Voting.css"; // Reuse parchment styles
import SwordLoader from "./HourglassLoader";
import { API_BASE_URL } from "../config";

const defaultAvatar =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAM1BMVEX4+PiGhoaUlJTq6uq/v7+NjY3x8fHb29uxsbHNzc2jo6PGxsbi4uKbm5u3t7fU1NSpqalb9J8wAAAERklEQVR4nO2cDZarIAyFq6go/tT9r/bJME61VgsSknBevhXcQAIkBB4PQRAEQRAEQRAEQRAEQRAEQRAEGFRXtaasi4W6NHP1HKgVBaD6+Uf5nnruFLUyH5rKHMWvjOxt0BfqHa2m1njBd/mWsqPWeYKffIvh6EjN5Cv/x5HYmaDLEP2LHz2pFe8JGn5HRa15g/L2/i0jGzdSge6zUjKxYPiw7XpawOJ8cV//crxgYIGK0M/Bgrv+v0IdB02k/sWChtSAOVZ/UcyU+qt4/UXR0+lXEPqLgi6QowPAMVLpB3EgC9GxKG4H2FLTrEQtlP4lPaDQDxTBDortDHACSKYAdAIoogBsCXLgL0RAe8BKja1fw+ovCux6F2gIWyZkA4A9CN2HBmj92Ee6Ht4A3FM1QCLzDm5iAx4CS26Jqb+B118UmJsx+C5gwYziZwoDMO89gA9CDsxl6EY1/TuYezH4QcKCmROIAWLA/25A9qtQkn0AMy3uUhiAuRMnOUpgZsWwRaFfUFMysLruC9yk+NbV/DUG1YAE6yhuXSVBRoNb2WrggwBVf4IgwL5tBd/KsBvpwH0I/YIAeB3Cv6IBXocIuklBwxh3F3OATgFJLyzgFKDWRf8AnAKifmqwGjvJRf0DrlmCru0M6J6GsJsdJI6pHMgS3/NH3bcY0/X6C3HfZfSplLDlzxFZ42LQhB9lAQP9URaw0B9hAbn/rzxvrUU1o2c0d3rYqfvW94Q9wrJMtF3rR7qgSSgZPkhs/GO5rrgNv0N5Xp3xe8b3h4cJ9cRXvkV145V80/N0nh2qP0kTTMV78Dc0upp3M1HOvc5g7N9Qg9Zd99RDNgMvCIIgCAIlSnfV1M6mLD+kZ3VZGtNOVafJn6EfaYZumgNyytFMfA53Q9/erFGPc089GUNvIsvTtSEzotET1BVTi1/ianQL2ixR49oANvZbSqzPq5rqMm2PsgHhDzGVYvA3JK4Z+X+jxdIEDPkWk2ZhHZDkWxLMQnj9nJcJVdrQ/UAJeX+mky2clyZATQK297yAucUJ/QIPEohfxMiG3xEbCfe+wIMk7js9SvdZibkPTPBy/g633YjY/V/cexvRkLv/i/nGeqpINq8zwkM59gc/aEK3ZW76Qy3gpz/MAohuSngCfmVkFb8vRl8L2Kz/73j2+CZ5LAyD156c5K0wFB71O7gPCFNQf1+KWC5AL74GMuMAcHw52CX5dweWy/SA5w6253I/Y+9AlgsnSvLWH57zUgWjFOaK03eLrLewLWdxnEEEO06+Sc5mAs5enmUzASdRkOS/lFR8ioJMliDHhynIZA9YOe4FSX6dSscxtckohC2Hv3AyOIbueQ/jzDzoeKTLzIMO/whktgZZ9tlxRseIlf1xIrsQeK9yMS0mXrEPAmo1d9jmxgk+8k7PNoqzOomubMuMTO5Tw9g+p86inPLO9jyX4Sq6X0fFAAqcAf8AkU5HyWczqdIAAAAASUVORK5CYII=";

const DEFAULT_SUBMISSIONS_ENDPOINT = `${API_BASE_URL}/public-submissions`;

export default function Gallery({
  submissionsApi = DEFAULT_SUBMISSIONS_ENDPOINT,
}) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(submissionsApi)
      .then((res) => setSubmissions(res.data))
      .catch(() =>
        setError(
          "We couldn't fetch the gallery just now. Please try again shortly."
        )
      )
      .finally(() => setLoading(false));
  }, [submissionsApi]);

  if (loading) {
    return (
      <div className="gallery-status">
        <SwordLoader />
        <p className="cottage-text">Summoning entries from the vault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-status">
        <p className="cottage-text error">{error}</p>
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="gallery-status">
        <p className="cottage-text">No submissions yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <section className="gallery-container" aria-label="Submission gallery">
      <header className="gallery-header">
        <h2 className="gallery-title">Gallery</h2>
        <p className="gallery-description">
          Stroll through the halls of Borked and admire every masterpiece.
        </p>
      </header>

      <div className="gallery-grid">
        {submissions.map((s) => {
          const projectName = s.projectName || "Untitled";
          const userName = s.user?.name || "Anonymous";
          const avatar = s.user?.avatar || defaultAvatar;

          return (
            <article key={s._id} className="voting-card gallery-card">
              <figure className="gallery-figure">
                <img
                  src={s.imageUrl}
                  alt={`${projectName} preview`}
                  className="voting-image gallery-image"
                />
              </figure>

              <div className="voting-card-body">
                <h3 className="voting-project gallery-project">
                  {projectName}
                </h3>

                <div className="voting-author gallery-author">
                  <img
                    src={avatar}
                    alt={`${userName}'s avatar`}
                    className="voting-avatar"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultAvatar;
                    }}
                  />
                  <span>{userName}</span>
                </div>

                {(s.siteUrl || s.sourceUrl) && (
                  <div className="gallery-links">
                    {s.siteUrl && (
                      <a
                        href={s.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="voting-link primary"
                      >
                        View Demo
                      </a>
                    )}
                    {s.sourceUrl && (
                      <a
                        href={s.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="voting-link secondary"
                      >
                        View Source
                      </a>
                    )}
                  </div>
                )}

                {s.description && (
                  <p className="voting-description gallery-description-blurb">
                    <span className="voting-description-label">
                      Description:
                    </span>{" "}
                    {s.description}
                  </p>
                )}

                {s.hackatime?.totalTime && (
                  <p className="gallery-meta">
                    <span>HackaTime:</span> {s.hackatime.totalTime}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
