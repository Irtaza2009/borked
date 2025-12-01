import React, { useState, useEffect } from 'react';
import './App.css';
import GameCanvas from './components/GameCanvas';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/profile`,
        { withCredentials: true }
      );
      setUser(response.data.user);
    } catch (error) {
      console.log('User not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const handleSlackLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/slack`;
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="stickman-loader">🏃‍♂️</div>
        <p>Loading the most terribly designed site ever...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-screen">
        <h1>🚪 Welcome to the Bad UI Design Competition! 🚪</h1>
        <p>Control a stickman through the worst user experience imaginable!</p>
        <div className="login-warning">
          ⚠️ WARNING: This site contains deliberately terrible UX patterns! ⚠️
        </div>
        <button onClick={handleSlackLogin} className="slack-login-btn">
          🔒 Enter via Slack (if you dare)
        </button>
        <div className="disclaimer">
          <small>By entering, you agree to experience frustratingly bad design choices</small>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="game-header">
        <h1>🎮 BAD UI STICKMAN ADVENTURE 🎮</h1>
        <div className="user-info">
          <span>Welcome, {user.name}! 👋</span>
          <button onClick={handleLogout} className="logout-btn">❌ Escape</button>
        </div>
      </div>
      <GameCanvas user={user} />
      <div className="instructions">
        <h3>🕹️ How to Suffer:</h3>
        <p>• Use WASD or Arrow keys to move your stickman</p>
        <p>• Find the moving square to build a bridge</p>
        <p>• Convince the rude stickman to move (ask twice!)</p>
        <p>• Enter doors for submission, gallery, or voting</p>
        <p>• Don't fall in the pit... or do! 🕳️</p>
      </div>
    </div>
  );
}

export default App;
