import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

import UsersList from "../utilities/UsersList";

import classes from "./Profile.module.css";

const Profile = (props) => {
  const params = useParams();
  const [user, setUser] = useState({
    id: 0,
    username: "",
    email: "",
    following: [],
    followers: [],
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/users/${params.username}`)
      .then((response) => {
        const userData = response.data;
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          following: userData.following,
          followers: userData.followers,
        });
      });
  }, [params.username]);

  let currentUser = localStorage.getItem("username");
  if (!currentUser) currentUser = "";

  const isCurrentUserProfile = user.username === currentUser;
  const isFollower = user.followers.includes(currentUser);
  console.log(isFollower);

  const [showFollowing, setShowFollowing] = useState(false);
  const onFollowingClickHandler = () => {
    setShowFollowing(true);
  };

  const onHideFollowing = () => {
    setShowFollowing(false);
  };

  const [showFollowers, setShowFollowers] = useState(false);
  const onFollowersClickHandler = () => {
    setShowFollowers(true);
  };

  const onHideFollowers = () => {
    setShowFollowers(false);
  };

  const onFollowHandler = () => {
    axios
      .put(`http://127.0.0.1:8000/api/users/${user.id}/follow`)
      .then((response) => {
        setUser((state) => {
          return {
            ...state,
            followers: state.followers.concat(currentUser),
          };
        });
      })
      .catch((error) => console.log(error));
  };

  const onUnfollowHandler = () => {
    axios
      .put(`http://127.0.0.1:8000/api/users/${user.id}/unfollow`)
      .then((response) => {
        setUser((state) => {
          return {
            ...state,
            followers: state.followers.filter(
              (username) => username !== currentUser
            ),
          };
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className={classes["profile"]}>
      {showFollowing && (
        <UsersList
          onHide={onHideFollowing}
          users={user.following}
          message="No Users"
          title="Following"
        />
      )}
      {showFollowers && (
        <UsersList
          onHide={onHideFollowers}
          users={user.followers}
          message="No Users"
          title="Followers"
        />
      )}

      <div>
        <span>Username</span>
        <span>{user.username}</span>
      </div>
      <div>
        <span>Email</span>
        <span>{user.email}</span>
      </div>
      <div>
        <button className={classes["button"]} onClick={onFollowingClickHandler}>
          Following
        </button>
        <span>{user.following.length}</span>
      </div>
      <div>
        <button className={classes["button"]} onClick={onFollowersClickHandler}>
          Followers
        </button>
        <span>{user.followers.length}</span>
      </div>

      {!isCurrentUserProfile &&
        !isFollower &&
        localStorage.getItem("username") && (
          <button
            onClick={onFollowHandler}
            className={classes["action-button"]}
          >
            Follow
          </button>
        )}

      {!isCurrentUserProfile && isFollower && localStorage.getItem("username") && (
        <button
          onClick={onUnfollowHandler}
          className={classes["action-button"]}
        >
          Unfollow
        </button>
      )}
    </div>
  );
};

export default Profile;
