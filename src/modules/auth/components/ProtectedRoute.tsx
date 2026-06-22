import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isDriveLinked, setIsDriveLinked] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          // Update local storage just in case it's out of sync
          localStorage.setItem('lardi_user', JSON.stringify(data.user));
          setIsAuthenticated(true);
          setIsDriveLinked(!!data.user.googleDriveInfo?.isLinked);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('lardi_user');
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]">
        <div className="flex flex-col items-center gap-4 text-moss-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-mono text-sm tracking-widest font-bold">VERIFICANDO LLAVE...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Force drive linking
  if (!isDriveLinked && window.location.pathname !== '/setup-drive') {
    return <Navigate to="/setup-drive" replace />;
  }

  return <Outlet />;
}
