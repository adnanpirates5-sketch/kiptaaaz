import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Features from "./components/Features";
import UserGuide from "./components/UserGuide";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import TermsConditions from "./components/TermsConditions";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Dashboard from "./components/dashboard/Dashboard";
import NavBar from "./components/theme/NavBar";
import AboutUs from "./components/AboutUs";
import Reviews from "./components/Reviews";
import Modal from "./components/Modal";
import { ThemeProvider } from "./components/theme/ThemeContext";

import { TranslationProvider } from "./components/theme/TranslationContext";

function App() {
  const [page, setPage] = useState("home");
  const [showGuide, setShowGuide] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setPage("dashboard");
    }

    // Check if the URL is for password reset
    if (window.location.pathname.startsWith('/reset-password/')) {
      setPage("reset-password");
    }
  }, []);

  return (
    <ThemeProvider>
      <TranslationProvider>
        <BrowserRouter>
          <div className="app-wrapper">
            {(page === "home" || page === "about" || page === "reviews") && (
              <NavBar 
                onNavigate={setPage} 
                onShowGuide={() => setShowGuide(true)}
              />
            )}

        {page === "home" && (
          <>
            <Landing 
              onGetStarted={() => setPage("login")} 
              onShowGuide={() => setShowGuide(true)}
            />
            <Features />
          </>
        )}

        <Modal isOpen={showGuide} onClose={() => setShowGuide(false)}>
          <UserGuide />
        </Modal>

        {page === "login" && (
          <Login
            onSwitchToRegister={() => setPage("register")}
            onBackHome={() => setPage("home")}
            onForgotPassword={() => setPage("forgot")}
            onLoginSuccess={() => setPage("dashboard")}
          />
        )}

        {page === "register" && (
          <Register
            onSwitchToLogin={() => setPage("login")}
            onBackHome={() => setPage("home")}
            onRegisterSuccess={() => setPage("dashboard")}
          />
        )}

        {page === "forgot" && (
          <ForgotPassword onBackToLogin={() => setPage("login")} />
        )}

        {page === "dashboard" && (
          <Dashboard onLogout={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setPage("home");
          }} />
        )}

        {page === "about" && (
          <AboutUs onBackHome={() => setPage("home")} />
        )}

        {page === "reviews" && (
          <Reviews onBackHome={() => setPage("home")} />
        )}

        <Routes>
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>

      </div>
    </BrowserRouter>
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default App;