import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserPortal from './components/user/UserPortal';
import AdminPortal from './components/admin/AdminPortal';
import SellerPortal from './components/seller/SellerPortal'; // ✅ ADD THIS
import './App.css';
import './admin.css';
import NotificationPermission from "./components/NotificationPermission";

// ✅ ScrollToTop Component
const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

           {/* Notification Permission */}
        <NotificationPermission />
        <Routes>
          {/* User Portal */}
          <Route path="/*" element={<UserPortal />} />

          {/* Admin Portal */}
          <Route path="/admin/*" element={<AdminPortal />} />

          {/* ✅ Seller Portal - ADD THIS ROUTE */}
          <Route path="/seller/*" element={<SellerPortal />} />

          {/* Default */}
          <Route path="*" element={<Navigate to="/" />} />
         
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;