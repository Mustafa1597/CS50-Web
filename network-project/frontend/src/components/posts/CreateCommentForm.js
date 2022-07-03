import React, { useRef, useState } from "react";

// import { useNavigate } from "react-router-dom";

import axios from "axios";

import classes from "./CreateCommentForm.module.css";

const CreateCommentForm = (props) => {
  const [rows, setRows] = useState(1);
  const [error, setError] = useState(false);
  // const navigate = useNavigate();
  const contentRef = useRef();

  const onPostCreation = (event) => {
    event.preventDefault();

    if (!localStorage.getItem("username")) {
      setError(true);
      return;
    }

    const text = contentRef.current.value;
    axios
      .post(`http://127.0.0.1:8000/api/posts/${props.postId}/comments`, {
        text,
      })
      .then((response) => props.onCommentCreation(response.data));
    contentRef.current.value = "";
  };

  const onTextChangeHandler = (event) => {
    const textLength = event.target.value.length;
    setRows((textLength + 50) / 50);
  };

  return (
    <form onSubmit={onPostCreation} className={classes["form"]}>
      <div className={classes["main"]}>
        <textarea
          ref={contentRef}
          className={classes["content"]}
          placeholder="Write a comment..."
          rows={rows}
          onChange={onTextChangeHandler}
        />
        <button type="submit">Post</button>
      </div>
      {error && <p className={classes["error"]}>Please Login First</p>}
    </form>
  );
};

export default CreateCommentForm;
