import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Features from "./components/Features";
import Login from "./components/Login";
import Register from "./components/Register";
import TermsConditions from "./components/TermsConditions";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import AboutUs from "./components/AboutUs";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./hooks/useLanguage";
import { TranslationProvider } from "./contexts/TranslationContext";

function App() {
  const [page, setPage] = useState("home");
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  return (
    <TranslationProvider language={language}>
      <BrowserRouter>
        <div className={`app-wrapper ${theme}`}>
          <NavBar 
            onNavigate={setPage} 
            theme={theme} 
            onThemeToggle={toggleTheme}
            language={language}
            onLanguageToggle={toggleLanguage}
          />

        {page === "home" && (
          <>
            <Landing onGetStarted={() => setPage("login")} />
            <Features />
          </>
        )}

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
          <AboutUs />
        )}

        <Routes>
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
        </Routes>

      </div>
    </BrowserRouter>
  </TranslationProvider>
  );
}

export default App;