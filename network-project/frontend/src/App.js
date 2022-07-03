import React, { useContext, useEffect } from "react";

import axios from "axios";

import { Routes, Route } from "react-router-dom";

import UserContext from "./store/UserContext";
import Home from "./components/Home";
import Posts from "./components/posts/Posts";
import Profile from "./components/profile/Profile";
import SignupForm from "./components/authentication/SignupForm";
import LoginForm from "./components/authentication/LoginForm";

import "./App.css";

if (localStorage.getItem("token")) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Token ${localStorage.getItem("token")}`;
}

function App() {
  const user = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      user.setUser(localStorage.getItem("username"));
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<Posts />} />
        <Route path="following" element={<Posts />} />
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <h1>There's nothing here!</h1>
            </main>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
