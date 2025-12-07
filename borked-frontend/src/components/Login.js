import React from "react";
import { BACKEND_URL } from "../config";

export default function Login() {
  const login = () => {
    window.location.href = `${BACKEND_URL}/auth/slack`;
  };

  return (
    <div className="form-container">
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <h2>Welcome to the Arena!</h2>
        <button onClick={login}>Login with Slack</button>
      </div>
    </div>
  );
}
