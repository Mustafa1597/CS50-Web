import React from "react";

const user = {
  username: null,
  setUser: (username) => {},
};

const UserContext = React.createContext(user);

export default UserContext;
