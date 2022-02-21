import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import TodoItem from "./components/TodoItem";

const initialState = {
  entities: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TODO": {
      return {
        ...state,
        entities: state.entities.concat({ ...action.payload }),
      };
    }
    case "COMPLETE_TODO": {
      const newTodos = state.entities.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, complete: !todo.complete };
        }
        return todo;
      });
      return {
        ...state,
        entities: newTodos,
      };
    }
    default:
      return state;
  }
};

const App = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      return;
    }
    const id = Math.random().toString(36);
    const todo = { title: value, complete: false, id: id };
    dispatch({ type: "ADD_TODO", payload: todo });
    setValue("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </form>
      <button>Mostrar Todos</button>
      <button>Completados</button>
      <button>Incompletos</button>
      <ul>
        {state.entities.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default App;
