import React from "react";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Notifications from "./pages/Notifications";
import Call from "./pages/Call";
import Chat from "./pages/Chat";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
const App = () => {
  //tanstack query : used to fetch data from the server
  // mutation : used to create, update, delete data from the server
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false, // auth check
  });
  console.log(data);

  return (
    <div className=" h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<SignUp />} />
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
