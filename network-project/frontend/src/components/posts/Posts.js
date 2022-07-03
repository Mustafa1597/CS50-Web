import React, { useState, useEffect, Fragment } from "react";

import { useLocation } from "react-router-dom";

import axios from "axios";

import CreatePostForm from "./CreatePostForm";
import Post from "./Post";

const Posts = (props) => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);

  const { pathname } = location;

  let urlEnd = "posts";
  if (pathname.includes("following")) {
    urlEnd += "/following";
  }

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/${urlEnd}`)
      .then((response) => setPosts(response.data))
      .catch((error) => console.log(error));
  }, [urlEnd]);

  const onCreatePostHandler = (post) => {
    setPosts((posts) => {
      return [post].concat(posts);
    });
  };

  return (
    <Fragment>
      <CreatePostForm onCreate={onCreatePostHandler} />
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          content={post.content}
          likesUsers={post.likes_users}
          created={post.created}
          writer={post.writer}
          comments={post.comments}
        />
      ))}
    </Fragment>
  );
};

export default Posts;
