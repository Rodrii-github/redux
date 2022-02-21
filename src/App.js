import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import TodoItem from "./components/TodoItem";

const initialState = {
  entities: [],
  visibilityFilter: "ALL", // "COMPLETE" || "INCOMPLETE"
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
    case "SET_FILTER": {
      return {
        ...state,
        visibilityFilter: action.payload,
      };
    }
    default:
      return state;
  }
};

const selectTodos = (state) => {
  const { entities, visibilityFilter } = state;

  if (visibilityFilter === "COMPLETE") {
    return entities.filter((todo) => todo.complete);
  }
  if (visibilityFilter === "INCOMPLETE") {
    return entities.filter((todo) => !todo.complete);
  }
  return entities;
};

const App = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);

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
      <button onClick={() => dispatch({ type: "SET_FILTER", payload: "ALL" })}>
        Mostrar Todos
      </button>
      <button
        onClick={() => dispatch({ type: "SET_FILTER", payload: "COMPLETE" })}
      >
        Completados
      </button>
      <button
        onClick={() => dispatch({ type: "SET_FILTER", payload: "INCOMPLETE" })}
      >
        Incompletos
      </button>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default App;
