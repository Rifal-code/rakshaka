import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ReportForm } from './pages/ReportForm';
import { ReportDetail } from './pages/ReportDetail';
import { LinkChecker } from './pages/LinkChecker';
import { PublicReports } from './pages/PublicReports';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<div className="animate-page-entrance"><Home /></div>} />
      <Route path="/login" element={<div className="animate-page-entrance"><Login /></div>} />
      <Route path="/register" element={<div className="animate-page-entrance"><Register /></div>} />
      <Route path="/reports" element={<div className="animate-page-entrance"><PublicReports /></div>} />
      <Route path="/reports/:id" element={<div className="animate-page-entrance"><ReportDetail /></div>} />

      {/* Protected User/Admin Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <div className="animate-page-entrance">
              <Dashboard />
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/new" 
        element={
          <ProtectedRoute>
            <div className="animate-page-entrance">
              <ReportForm />
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/:id/edit" 
        element={
          <ProtectedRoute>
            <div className="animate-page-entrance">
              <ReportForm />
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/link-checker" 
        element={
          <ProtectedRoute>
            <div className="animate-page-entrance">
              <LinkChecker />
            </div>
          </ProtectedRoute>
        } 
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
