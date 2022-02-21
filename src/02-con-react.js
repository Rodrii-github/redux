import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const reducer = (state = 0, action) => {
  console.log({ action, state });
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "set":
      return action.payload;
    default:
      return state;
  }
};

function App() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const set = () => {
    dispatch({ type: "set", payload: value });
    setValue("");
  };
  return (
    <div>
      <p>Contador: {state}</p>
      <button onClick={() => dispatch({ type: "increment" })}>
        Incrementar
      </button>
      <button onClick={() => dispatch({ type: "decrement" })}>
        Decrementar
      </button>
      <button onClick={set}>Set</button>
      <input value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </div>
  );
}

export default App;
