import React, { Fragment } from "react";

import Comment from "./Comment";
import CreateCommentForm from "./CreateCommentForm";

import classes from "./Comments.module.css";

const Comments = (props) => {
  const comments = props.comments;

  const content = (
    <Fragment>
      <ul className={classes["comments-list"]}>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            id={comment.id}
            user={comment.user}
            text={comment.text}
            written={comment.written}
            onDelete={props.onCommentDeletion}
          />
        ))}
      </ul>
    </Fragment>
  );

  const empty = <p className={classes["empty"]}>No Comments Available</p>;

  return (
    <div className={classes["comments"]}>
      <CreateCommentForm
        onCommentCreation={props.onCommentCreation}
        postId={props.postId}
      />
      {comments.length > 0 ? content : empty}
    </div>
  );
};

export default Comments;
