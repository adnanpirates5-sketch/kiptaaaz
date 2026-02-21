// src/App.js or src/index.js
import './App.css';  // Make sure the global styles are still imported
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";  // Update imports

import Landing from "./components/Landing";
import Features from "./components/Features";
import Login from "./components/Login";
import Register from "./components/Register";
import TermsConditions from "./components/TermsConditions";  // Import Terms and Conditions component

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
          />
        )}

        {page === "register" && (
          <Register
            onSwitchToLogin={() => setPage("login")}
            onBackHome={() => setPage("home")}
          />
        )}

        {/* Define the route for Terms and Conditions */}
        <Routes>
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;