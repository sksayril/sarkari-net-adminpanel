import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './components/LoginPage';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import HomePage from './pages/HomePage';
import LatestJobs from './pages/LatestJobs';
import Results from './pages/Results';
import AdmitCards from './pages/AdmitCards';
import AnswerKey from './pages/AnswerKey';
import Syllabus from './pages/Syllabus';
import Admission from './pages/Admission';
import Importance from './pages/Importance';
import TopCategory from './pages/TopCategory';
import AiBot from './pages/AiBot';
import ApiService from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = ApiService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    
    checkAuth();
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/admin" replace /> : 
                <LoginPage onLogin={setIsAuthenticated} />
            } 
          />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/employees" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <Employees />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/homepage" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <HomePage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/latest-jobs" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <LatestJobs />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/results" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <Results />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/admit-cards" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <AdmitCards />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/answer-key" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <AnswerKey />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/syllabus" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <Syllabus />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/admission" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <Admission />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/importance" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <Importance />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/top-category" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <TopCategory />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/ai-bot" element={
            <ProtectedRoute>
              <AdminLayout onLogout={() => {
                ApiService.logout();
                setIsAuthenticated(false);
              }}>
                <AiBot />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;