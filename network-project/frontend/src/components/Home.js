import React, { Fragment, useContext } from "react";

import axios from "axios";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

import UserContext from "../store/UserContext";

import classes from "./Home.module.css";

const Home = (props) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const onLogoutHandler = () => {
    console.log(axios.defaults.headers.common["Authorization"]);
    axios.post("http://127.0.0.1:8000/api/users/logout").then((response) => {
      localStorage.clear();
      delete axios.defaults.headers.common["Authorization"];
      user.setUser(null);
      navigate("../login");
    });
  };

  const username = localStorage.getItem("username")
    ? localStorage.getItem("username")
    : "";
  const authorizedUserContent = (
    <Fragment>
      <NavLink
        className={({ isActive }) => (isActive ? classes["link"] : undefined)}
        to="/following"
      >
        FOLLOWING
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? classes["link"] : undefined)}
        to={`/profile/${username}`}
      >
        {username.toUpperCase()}
      </NavLink>
      <button className={classes["button"]} onClick={onLogoutHandler}>
        Logout
      </button>
    </Fragment>
  );

  const unauthorizedUserContent = (
    <div className={classes["adjacent"]}>
      <NavLink
        className={({ isActive }) => (isActive ? classes["link"] : undefined)}
        to="../login"
      >
        Login
      </NavLink>
      <NavLink
        className={({ isActive }) => (isActive ? classes["link"] : undefined)}
        to="../signup"
      >
        Signup
      </NavLink>
    </div>
  );

  return (
    <Fragment>
      <div className={classes["content"]}>
        <div className={classes["side"]}>
          <h3 className={classes["logo"]}>NETWORK</h3>
          <NavLink
            className={({ isActive }) =>
              isActive ? classes["link"] : undefined
            }
            to="/"
          >
            ALL POSTS
          </NavLink>

          {localStorage.getItem("token") === null
            ? unauthorizedUserContent
            : authorizedUserContent}
        </div>
        <main className={classes["main"]}>
          <Outlet />
        </main>
      </div>
      <footer className={classes["footer"]}>
        <h1>Network</h1>
      </footer>
    </Fragment>
  );
};

export default Home;
