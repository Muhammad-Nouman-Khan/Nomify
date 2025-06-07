import React from "react";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Notifications from "./pages/Notifications";
import Call from "./pages/Call";
import Chat from "./pages/Chat";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <div className=" h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/call" element={<Call />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
