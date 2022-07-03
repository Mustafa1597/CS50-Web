import React, { useState } from "react";

import UserContext from "./UserContext";

const UserContextProvider = (props) => {
  const [username, setUsername] = useState(null);

  const setUser = (username) => {
    setUsername(username);
  };

  return (
    <UserContext.Provider value={{ username, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
