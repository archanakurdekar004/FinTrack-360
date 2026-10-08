import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';
import authService from '../../services/authService';

export const MainLayout = () => {
  const [backendStatus, setBackendStatus] = useState({ connected: false, data: null });

  useEffect(() => {
    let isMounted = true;
    const checkConnection = async () => {
      try {
        const response = await authService.checkBackendHealth();
        if (isMounted) {
          setBackendStatus({ connected: true, data: response?.data });
        }
      } catch (_err) {
        if (isMounted) {
          setBackendStatus({ connected: false, data: null });
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <Navbar backendStatus={backendStatus} />
      
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet context={{ backendStatus }} />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
