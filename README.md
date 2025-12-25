# Borked

A fun project submission/gallery site! (currently in beta with some mock data!)

## Local Development Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Slack OAuth credentials (for authentication)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd borked-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```
   MONGO_URI=your_mongodb_connection_string
   SLACK_CLIENT_ID=your_slack_client_id
   SLACK_CLIENT_SECRET=your_slack_client_secret
   SESSION_SECRET=your_session_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd borked-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `src/config.js` file:
   ```javascript
   export const API_BASE_URL = "http://localhost:5000";
   export const BACKEND_URL = "http://localhost:5000";
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

The application should now be running at `http://localhost:3000`
