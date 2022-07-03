import React, { useState, useContext } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import UserContext from "../../store/UserContext";
import UsersList from "../utilities/UsersList";
import Comments from "./Comments";

import classes from "./Post.module.css";

const Post = (props) => {
  const currentUser = useContext(UserContext);

  const date = new Date(props.created);
  const [likesUsers, setLikesUsers] = useState(props.likesUsers);
  const isLiked = likesUsers.includes(currentUser.username);

  const onLikeClickHandler = () => {
    if (!isLiked) {
      axios
        .post(`http://127.0.0.1:8000/api/posts/${props.id}/like`)
        .then((response) => {
          setLikesUsers((state) => {
            return state.concat(currentUser.username);
          });
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .delete(`http://127.0.0.1:8000/api/posts/${props.id}/unlike`)
        .then((response) => {
          setLikesUsers((state) => {
            return state.filter((user) => user !== currentUser.username);
          });
        });
    }
  };

  const [showLikes, setShowLikes] = useState(false);

  const onShowLikesHandler = (event) => {
    setShowLikes(true);
  };

  const onHideHandler = (event) => {
    setShowLikes(false);
  };

  const onExpandHandler = () => {
    setExpand(true);
  };

  const [expand, setExpand] = useState(props.content.length < 300);
  const compressedContent = (
    <p
      onClick={onExpandHandler}
      className={`${classes["content"]} ${classes["compressed-content"]}`}
    >
      {props.content.substring(0, 300)}
      <span>{"...Read More"}</span>
    </p>
  );
  const expandedContent = (
    <p className={`${classes["content"]} ${classes["expanded-content"]}`}>
      {props.content}
    </p>
  );

  const [showComments, setShowComments] = useState(false);

  const onShowCommentsHandler = () => {
    setShowComments((state) => {
      return !state;
    });
  };

  const [comments, setComments] = useState(props.comments);

  const onCommentCreationHandler = (comment) => {
    setComments((comments) => {
      return comments.concat(comment);
    });
  };

  const onCommentDeletionHandler = (commentId) => {
    setComments((comments) => {
      return comments.filter((comment) => comment.id !== commentId);
    });
  };

  return (
    <div className={classes["post"]}>
      {showLikes && (
        <UsersList
          onHide={onHideHandler}
          users={likesUsers}
          message="No Likes"
          title="Likes"
        />
      )}

      <Link
        className={classes["link"]}
        to={`../profile/${props.writer.username}`}
      >
        {props.writer.username}
      </Link>

      {expand ? expandedContent : compressedContent}

      <span className={classes["post-date"]}>{`${date
        .toDateString()
        .substring(4)}`}</span>

      <div className={classes["post-footer"]}>
        <div className={classes["left"]}>
          <div className={classes["like"]}>
            <span>{likesUsers.length}</span>
            <span onClick={onShowLikesHandler}>Likes</span>
          </div>

          <div className={classes["comment"]}>
            <span>{comments.length}</span>
            <span onClick={onShowCommentsHandler}>Comments</span>
          </div>
        </div>

        <div className={classes["right"]}>
          {currentUser.username && (
            <button
              className={classes["like-button"]}
              onClick={onLikeClickHandler}
            >
              {isLiked ? "Unlike" : "Like"}
            </button>
          )}
        </div>
      </div>

      {showComments && (
        <Comments
          onCommentCreation={onCommentCreationHandler}
          onCommentDeletion={onCommentDeletionHandler}
          comments={comments}
          postId={props.id}
        />
      )}
    </div>
  );
};

export default Post;
