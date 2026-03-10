import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AdminRoute from './components/AdminRoute';

// Eagerly load Home (above-the-fold critical path)
import Home from './pages/Home';

// Lazy load all other pages — splits them into separate JS chunks
const CarListing = lazy(() => import('./pages/CarListing'));
const CarDetails = lazy(() => import('./pages/CarDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Reserved = lazy(() => import('./pages/Reserved'));
const Experience = lazy(() => import('./pages/Experience'));
const EPerformance = lazy(() => import('./pages/EPerformance'));
const Finder = lazy(() => import('./pages/Finder'));

// Admin pages — heavy, never needed on first load
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Inventory = lazy(() => import('./pages/admin/Inventory'));
const Bookings = lazy(() => import('./pages/admin/Bookings'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Settings = lazy(() => import('./pages/admin/Settings'));

// Minimal loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
  </div>
);

// Layout component for main app pages
const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-white text-gray-900">
    <Header />
    <main className="relative">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin Routes - No Header/Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><Bookings /></AdminRoute>} />
            <Route path="/admin/customers" element={<AdminRoute><Customers /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />

            {/* Main App Routes - With Header/Footer */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/cars" element={<MainLayout><CarListing /></MainLayout>} />
            <Route path="/cars/:id" element={<MainLayout><CarDetails /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/reserved" element={<MainLayout><Reserved /></MainLayout>} />
            <Route path="/experience" element={<MainLayout><Experience /></MainLayout>} />
            <Route path="/e-performance" element={<MainLayout><EPerformance /></MainLayout>} />
            <Route path="/finder" element={<MainLayout><Finder /></MainLayout>} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
