import React, { useMemo } from "react";

export default function Submitted({ lockedType = "voting" }) {
  const isSubmission = lockedType === "submission";
  const lockLabel = useMemo(
    () => lockedType.charAt(0).toUpperCase() + lockedType.slice(1),
    [lockedType]
  );

  return (
    <div className="submitted-container" role="status" aria-live="polite">
      {!isSubmission && (
        <div className="submitted-banner">
          <h1 className="submitted-title">🎉 Submission Received!</h1>
          <p className="submitted-copy">
            Thank you for submitting. Your entry has been successfully recorded.
          </p>
        </div>
      )}

      <div className="submitted-lock">
        <span className="submitted-lock-icon" aria-hidden="true">
          🕒
        </span>
        <div className="submitted-lock-text">
          <div>
            <strong>{lockLabel}</strong> is currently locked.
          </div>
          <p className="submitted-note">
            Please check back once {lockedType} begins.
          </p>
        </div>
      </div>
    </div>
  );
}
