import React from "react";
import { BACKEND_URL } from "../config";

export default function Login() {
  const login = () => {
    window.location.href = `${BACKEND_URL}/auth/slack`;
  };

  return (
    <div className="form-container">
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <h2>Borked</h2>
        <h3 style={{ margin: 0, letterSpacing: "0.12em", textTransform: "uppercase" }}>A Bad UI Competition</h3>
        <button onClick={login}>Login with Slack</button>
      </div>
    </div>
  );
}
