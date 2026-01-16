import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Report from './pages/Report';
import Practice from './pages/Practice';
import PracticeSession from './pages/PracticeSession';
import Game from './pages/Game';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
              <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
              <Route path="/practice-session" element={<ProtectedRoute><PracticeSession /></ProtectedRoute>} />
              <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}


export default App;
