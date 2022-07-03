import React from "react";

import { Link } from "react-router-dom";

import Modal from "../ui/Modal";

import classes from "./UsersList.module.css";

const UsersList = (props) => {
  const hasUsers = props.users.length > 0;

  const users = (
    <ul className={classes["users"]}>
      {props.users.map((user) => (
        <li key={user}>
          <Link
            onClick={props.onHide}
            className={classes["link"]}
            to={`../profile/${user}`}
          >
            {user}
          </Link>
        </li>
      ))}
    </ul>
  );

  const noUsers = <p className={classes["no-users"]}>{props.message}</p>;

  return (
    <Modal onHide={props.onHide}>
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className={classes["container"]}
      >
        <h2 className={classes["title"]}>{props.title}</h2>
        {hasUsers ? users : noUsers}
        <button onClick={props.onHide}>Close</button>
      </div>
    </Modal>
  );
};

export default UsersList;
