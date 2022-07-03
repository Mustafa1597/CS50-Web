import React, { useState, useContext } from "react";

import axios from "axios";
import Cookies from "js-cookie";

import { useNavigate, useLocation } from "react-router-dom";

import UserContext from "../../store/UserContext";
import useInput from "./use-input";

import classes from "./AuthenticationForm.module.css";

const LoginForm = () => {
  const user = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [hasError, setHasError] = useState(false);

  const {
    input: enteredUsername,
    isValidInput: isValidUsername,
    isBlured: isUsernameBlured,
    setInput: setEnteredUsername,
    setBlured: setUsernameBlured,
  } = useInput((username) => username.length > 0);

  const {
    input: enteredPassword,
    isValidInput: isValidPassword,
    isBlured: isPasswordBlured,
    setInput: setEnteredPassword,
    setBlured: setPasswordBlured,
  } = useInput((password) => password.length >= 5);

  const isValidForm = isValidUsername && isValidPassword;

  const onLoginHandler = (event) => {
    event.preventDefault();

    axios
      .post(
        "http://127.0.0.1:8000/api/users/login",
        {},
        {
          auth: {
            username: enteredUsername,
            password: enteredPassword,
          },
        }
      )
      .then((response) => {
        localStorage.setItem("username", enteredUsername);
        localStorage.setItem("token", response.data["token"]);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Token ${response.data["token"]}`;
        user.setUser(enteredUsername);
        navigate("..");
      })
      .catch((error) => {
        setHasError(true);
      });
  };

  const onSignupClickHandler = () => {
    navigate(location.pathname.replace("login", "signup"));
  };

  return (
    <form onSubmit={onLoginHandler} className={classes["form"]}>
      <h1>LOGIN</h1>
      <div className={classes["form-controls"]}>
        <div className={classes["form-control"]}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={enteredUsername}
            onBlur={setUsernameBlured}
            onChange={setEnteredUsername}
            placeholder="username"
          />
          {isUsernameBlured && !isValidUsername ? (
            <p className={classes["error"]}>Invalid username</p>
          ) : undefined}
        </div>

        <div className={classes["form-control"]}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            onBlur={setPasswordBlured}
            onChange={setEnteredPassword}
            placeholder="password"
          />
          {isPasswordBlured && !isValidPassword ? (
            <p className={classes["error"]}>Invalid password</p>
          ) : undefined}
        </div>
      </div>
      {hasError && (
        <p className={`${classes["error"]} ${classes["response-error"]}`}>
          username or password is incorrect
        </p>
      )}
      <div className={classes["form-actions"]}>
        <button type="submit" disabled={!isValidForm}>
          Login
        </button>
        <button onClick={onSignupClickHandler}>Signup</button>
      </div>
    </form>
  );
};

export default LoginForm;
