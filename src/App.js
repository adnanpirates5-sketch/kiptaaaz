import React, { useState } from "react";
import "./App.css";

import Landing from "./components/Landing";
import Features from "./components/Features";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [page, setPage] = useState("home");

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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
    </div>
  );
}

export default App;