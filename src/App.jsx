import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import SubscriptionBanner from './components/SubscriptionBanner';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Report = lazy(() => import('./pages/Report'));
const Practice = lazy(() => import('./pages/Practice'));
const PracticeSession = lazy(() => import('./pages/PracticeSession'));
const Game = lazy(() => import('./pages/Game'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Exams = lazy(() => import('./pages/Exams'));
const ExamLanding = lazy(() => import('./pages/ExamLanding'));
const ExamPractice = lazy(() => import('./pages/ExamPractice'));

// Loading Fallback
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0a0a0c] text-primary">
    <div className="animate-pulse text-xl font-mono">Loading System...</div>
  </div>
);

// Layout Component to control Navbar visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/practice-session', '/game', '/exams/:id'];
  const shouldHideNavbar = hideNavbarRoutes.some(route => location.pathname.match(new RegExp(route.replace(':id', '[^/]+'))));

  return (
    <>
      <SubscriptionBanner />
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <LanguageProvider>
          <AuthProvider>
            <div className="app-container">
              <Layout>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/practice" replace />} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/report" element={<ProtectedRoute allowExpired={true}><Report /></ProtectedRoute>} />
                    <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
                    <Route path="/practice-session" element={<ProtectedRoute><PracticeSession /></ProtectedRoute>} />
                    <Route path="/game" element={<ProtectedRoute><Game /></ProtectedRoute>} />
                    <Route path="/pricing" element={<ProtectedRoute allowExpired={true}><Pricing /></ProtectedRoute>} />
                    <Route path="/typing-exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
                    <Route path="/typing-exams/:slug" element={<ProtectedRoute><ExamLanding /></ProtectedRoute>} />
                    <Route path="/exams/:id" element={<ProtectedRoute><ExamPractice /></ProtectedRoute>} />
                  </Routes>
                </Suspense>
              </Layout>
            </div>
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
