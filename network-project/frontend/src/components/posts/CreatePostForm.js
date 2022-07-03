import React, { useRef, useState } from "react";

// import { useNavigate } from "react-router-dom";

import axios from "axios";

import classes from "./CreatePostForm.module.css";

const CreatePostForm = (props) => {
  const [error, setError] = useState(false);
  // const navigate = useNavigate();
  const contentRef = useRef();

  const onPostCreation = (event) => {
    event.preventDefault();

    if (!localStorage.getItem("username")) {
      setError(true);
      return;
    }

    const content = contentRef.current.value;
    axios
      .post("http://127.0.0.1:8000/api/posts/", { content })
      .then((response) => {
        props.onCreate(response.data);
      });
  };

  return (
    <form onSubmit={onPostCreation} className={classes["form"]}>
      <h2 className={classes["title"]}>create a post</h2>
      <textarea
        ref={contentRef}
        className={classes["content"]}
        placeholder="What is in your mind?"
        rows="5"
      />
      {error && <p className={classes["error"]}>Please Login First</p>}
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePostForm;
