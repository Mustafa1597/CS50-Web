import React from "react";

import axios from "axios";
import Cookies from "js-cookie";

import { useNavigate, useLocation } from "react-router-dom";

import useInput from "./use-input";

import classes from "./AuthenticationForm.module.css";

const SignupForm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    input: enteredUsername,
    isValidInput: isValidUsername,
    isBlured: isUsernameBlured,
    setInput: setEnteredUsername,
    setBlured: setUsernameBlured,
  } = useInput((username) => username.length > 0);

  const {
    input: enteredEmail,
    isValidInput: isValidEmail,
    isBlured: isEmailBlured,
    setInput: setEnteredEmail,
    setBlured: setEmailBlured,
  } = useInput(
    (email) =>
      email.includes("@") &&
      email.charAt(0) !== "@" &&
      email.charAt(email.length - 1) !== "@"
  );

  const {
    input: enteredPassword,
    isValidInput: isValidPassword,
    isBlured: isPasswordBlured,
    setInput: setEnteredPassword,
    setBlured: setPasswordBlured,
  } = useInput((password) => password.length >= 5);

  const {
    input: enteredConfirmedPassword,
    isValidInput: isValidConfirmedPassword,
    isBlured: isConfirmedPasswordBlured,
    setInput: setEnteredConfirmedPassword,
    setBlured: setConfirmedPasswordBlured,
  } = useInput((confirmedPassword) => confirmedPassword === enteredPassword);

  const isValidForm =
    isValidUsername &&
    isValidEmail &&
    isValidPassword &&
    isValidConfirmedPassword;

  const onSignupHandler = (event) => {
    event.preventDefault();

    axios
      .post(
        "http://127.0.0.1:8000/api/users/signup",
        {
          username: enteredUsername,
          email: enteredEmail,
          password: enteredPassword,
          confirmed_password: enteredConfirmedPassword,
        },
        {
          headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        }
      )
      .then((response) =>
        navigate(`${location.pathname.replace("signup", "login")}`)
      );
  };

  return (
    <form onSubmit={onSignupHandler} className={classes["form"]}>
      <h1>SIGNUP</h1>
      <div className={classes["form-controls"]}>
        <div className={classes["form-control"]}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={enteredUsername}
            onBlur={setUsernameBlured}
            onChange={setEnteredUsername}
          />
          {isUsernameBlured && !isValidUsername ? (
            <p className={classes["error"]}>Invalid username</p>
          ) : undefined}
        </div>

        <div className={classes["form-control"]}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            onBlur={setEmailBlured}
            onChange={setEnteredEmail}
          />
          {isEmailBlured && !isValidEmail ? (
            <p className={classes["error"]}>Invalid Email</p>
          ) : undefined}
        </div>

        <div className={classes["form-control"]}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="password"
            onBlur={setPasswordBlured}
            onChange={setEnteredPassword}
          />
          {isPasswordBlured && !isValidPassword ? (
            <p className={classes["error"]}>Invalid password</p>
          ) : undefined}
        </div>

        <div className={classes["form-control"]}>
          <label htmlFor="confirmed-password">Confirm Password</label>
          <input
            id="confirmed-password"
            type="password"
            placeholder="confirm password"
            onBlur={setConfirmedPasswordBlured}
            onChange={setEnteredConfirmedPassword}
          />
          {isConfirmedPasswordBlured && !isValidConfirmedPassword ? (
            <p className={classes["error"]}>
              password and confirmed password are different
            </p>
          ) : undefined}
        </div>
      </div>

      <div className={classes["form-actions"]}>
        <button type="submit" disabled={!isValidForm}>
          Signup
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
