import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SessionLobby from './pages/SessionLobby';
import VoteSession from './pages/VoteSession';
import Matches from './pages/Matches';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:id"
          element={
            <ProtectedRoute>
              <SessionLobby />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:id/vote"
          element={
            <ProtectedRoute>
              <VoteSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:id/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
