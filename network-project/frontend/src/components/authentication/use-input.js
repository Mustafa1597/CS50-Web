import { useState } from "react";

const useInput = (isInputValid) => {
  const [inputState, setInputState] = useState({
    input: "",
    isValidInput: false,
    isBlured: false,
  });

  const setInput = (event) => {
    const val = event.target.value;
    setInputState((state) => {
      return {
        ...state,
        input: val,
        isValidInput: isInputValid(val),
      };
    });
  };

  const setBlured = () => {
    setInputState((state) => {
      return {
        ...state,
        isValidInput: isInputValid(state.input),
        isBlured: true,
      };
    });
  };

  return {
    input: inputState.input,
    isValidInput: inputState.isValidInput,
    isBlured: inputState.isBlured,
    setInput,
    setBlured,
  };
};

export default useInput;
