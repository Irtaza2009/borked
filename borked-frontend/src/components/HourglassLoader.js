import "./HourglassLoader.css";

export default function HourglassLoader() {
  return (
    <div className="parchment-loader" role="status" aria-live="polite">
      <div className="loader-hourglass" aria-hidden="true">
        <div className="hourglass-shell">
          <span className="hourglass-sand hourglass-sand-top" />
          <span className="hourglass-sand hourglass-sand-stream" />
          <span className="hourglass-sand hourglass-sand-bottom" />
        </div>
      </div>

      <div className="loader-banner" aria-hidden="true">
        <span className="scroll-rod scroll-rod--left" />
        <div className="banner-mask">
          <div className="banner-body">
            <span className="banner-text">Loading...</span>
          </div>
        </div>
        <span className="scroll-rod scroll-rod--right" />
      </div>

      <span className="visually-hidden">Loading content</span>
    </div>
  );
}
