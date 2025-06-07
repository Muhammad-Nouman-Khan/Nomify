import React from "react";
import { Routes, Route, Navigate } from "react-router";
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
  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false, // auth check
  });
  const authUser = authData?.user; //here its user because we are returning user from this endpoint
  return (
    <div className=" h-screen" data-theme="night">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/onboarding"
          element={authUser ? <Onboarding /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <Notifications /> : <Navigate to="/login" />}
        />
        <Route
          path="/call"
          element={authUser ? <Call /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={authUser ? <Chat /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
