import React, { useMemo } from "react";

const STATE_COPY = {
  submitSuccess: {
    banner: {
      title: "🎉 Submission Received!",
      body: "Thank you for submitting. Your entry has been successfully recorded.",
    },
    lockIcon: "🗳️",
    lockHeading: (
      <>
        <strong>You're all set..</strong> 
      </>
    ),
    lockNote: "Head over to voting to vote once the round begins. Enjoy browsing the entries in the gallery in the meantime!",
  },
  submitFirst: {
    banner: {
      title: "Submit to Start Voting",
      body: "Share your creation on the Submit tab to unlock the voting arena.",
    },
    lockIcon: "📝",
    lockHeading: (
      <>
        <strong>Submission required.</strong> Voting unlocks after you submit your project.
      </>
    ),
    lockNote: "Head over to the Submit tab, drop in your entry, and then swing back here to cast your votes.",
  },
  votingLocked: {
    banner: {
      title: "Voting Locked",
      body: "The voting round is currently closed.",
    },
    lockIcon: "🕒",
    lockHeading: (
      <>
        <strong>Voting is locked.</strong>
      </>
    ),
    lockNote: "Please check back once the voting period begins.",
  },
};

export default function Submitted({ lockedType = "votingLocked" }) {
  const copyKey = useMemo(
    () => (STATE_COPY[lockedType] ? lockedType : "votingLocked"),
    [lockedType]
  );

  const { banner, lockIcon, lockHeading, lockNote } = STATE_COPY[copyKey];

  return (
    <div className="submitted-container" role="status" aria-live="polite">
      {banner && (
        <div className="submitted-banner">
          <h1 className="submitted-title">{banner.title}</h1>
          {banner.body && <p className="submitted-copy">{banner.body}</p>}
        </div>
      )}

      <div className="submitted-lock">
        {lockIcon && (
          <span className="submitted-lock-icon" aria-hidden="true">
            {lockIcon}
          </span>
        )}
        <div className="submitted-lock-text">
          <div>{lockHeading}</div>
          {lockNote && <p className="submitted-note">{lockNote}</p>}
        </div>
      </div>
    </div>
  );
}
