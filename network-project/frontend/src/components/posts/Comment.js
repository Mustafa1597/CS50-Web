import React, { useContext } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import UserContext from "../../store/UserContext";

import classes from "./Comment.module.css";

const Comment = (props) => {
  const user = useContext(UserContext);

  const onDeleteHandler = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/posts/comments/${props.id}`)
      .then((response) => {
        props.onDelete(props.id);
      });
  };

  const date = new Date(props.written);
  return (
    <li className={classes["comment"]}>
      <Link
        to={`./profile/${props.user.username}`}
        className={classes["username"]}
      >
        {props.user.username}
      </Link>
      <span>{props.text}</span>
      <div className={classes["footer"]}>
        <span>{date.toDateString().substring(4)}</span>
        {user.username === props.user.username && (
          <button
            onClick={onDeleteHandler}
            className={classes["delete-button"]}
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
};

export default Comment;
