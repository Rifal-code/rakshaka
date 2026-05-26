import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ReportForm } from './pages/ReportForm';
import { LinkChecker } from './pages/LinkChecker';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User/Admin Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/new" 
        element={
          <ProtectedRoute>
            <ReportForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/:id/edit" 
        element={
          <ProtectedRoute>
            <ReportForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/link-checker" 
        element={
          <ProtectedRoute>
            <LinkChecker />
          </ProtectedRoute>
        } 
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
