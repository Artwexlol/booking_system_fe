// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminPage from "./pages/AdminPage";
import RegisterPage from "./pages/RegisterPage";
import type { JSX } from "react";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        Betöltés...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RedirectIfLoggedIn({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfLoggedIn>
            <LoginPage />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfLoggedIn>
              <RegisterPage />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/calendar"
        element={
          <RequireAuth>
            <CalendarPage />
          </RequireAuth>
        }
      />
      <Route
        path="/bookings"
        element={
          <RequireAuth>
            <MyBookingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
