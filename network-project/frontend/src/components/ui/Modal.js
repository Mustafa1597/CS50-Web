import React from "react";
import ReactDOM from "react-dom";

import classes from "./Modal.module.css";

const Modal = (props) => {
  return ReactDOM.createPortal(
    <div onClick={props.onHide} className={classes["modal"]}>
      {props.children}
    </div>,
    document.getElementById("overlay")
  );
};

export default Modal;
