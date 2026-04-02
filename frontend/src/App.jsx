import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Features from "./components/Features";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import TermsConditions from "./components/TermsConditions";
import ForgotPassword from "./components/auth/ForgotPassword";
import Dashboard from "./components/dashboard/Dashboard";
import NavBar from "./components/theme/NavBar";
import AboutUs from "./components/AboutUs";
import { ThemeProvider } from "./components/theme/ThemeContext";
import { TranslationProvider } from "./components/theme/TranslationContext";

function App() {
  const [page, setPage] = useState("home");

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setPage("dashboard");
    }
  }, []);

  return (
    <ThemeProvider>
      <TranslationProvider>
        <BrowserRouter>
          <div className="app-wrapper">
            {page === "home" && (
              <NavBar 
                onNavigate={setPage} 
              />
            )}

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
    </ThemeProvider>
  );
}

export default App;