import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Friends from './pages/Friends';
import SessionLobby from './pages/SessionLobby';
import VoteSession from './pages/VoteSession';
import Matches from './pages/Matches';
import ProtectedRoute from './components/ProtectedRoute';
import HeroLayout from './components/HeroLayout';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Public Route for Login, also wrapped in HeroLayout for consistency */}
          <Route element={<HeroLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes wrapped in HeroLayout */}
          <Route element={
            <ProtectedRoute>
              <HeroLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/session/:id" element={<SessionLobby />} />
            <Route path="/session/:id/vote" element={<VoteSession />} />
            <Route path="/session/:id/matches" element={<Matches />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
