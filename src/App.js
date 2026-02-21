import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Features from "./components/Features";
import Login from "./components/Login";
import Register from "./components/Register";
import TermsConditions from "./components/TermsConditions";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  const [page, setPage] = useState("home");

  return (
    <BrowserRouter>
      <div className="app-wrapper">

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
          />
        )}

        {page === "register" && (
          <Register
            onSwitchToLogin={() => setPage("login")}
            onBackHome={() => setPage("home")}
          />
        )}

        {page === "forgot" && (
          <ForgotPassword
            onBackToLogin={() => setPage("login")}
          />
        )}

        <Routes>
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;