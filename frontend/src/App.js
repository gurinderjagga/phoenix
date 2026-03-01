import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarListing from './pages/CarListing';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import Bookings from './pages/admin/Bookings';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRoute from './components/AdminRoute';

import ScrollToTop from './components/ScrollToTop';

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
          <Route path="/orders" element={<MainLayout><Orders /></MainLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
