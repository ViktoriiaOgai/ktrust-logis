import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AdminNavigation from "@/components/layouts/AdminNavigation/AdminNavigation";
import "./RootLayout.css";

export default function RootLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isAdminRoute = pathname.startsWith('/dashboard') || 
                       pathname.startsWith('/orders') || 
                       pathname.startsWith('/customers') || 
                       pathname.startsWith('/users');

  return (
    <div className="root-layout">
      {isAdminRoute && user && ['Admin', 'Operator', 'Courier'].includes(user.role) && (
        <AdminNavigation />
      )}
      <main className="root-layout__content">
        <Outlet />
      </main>
    </div>
  );
}