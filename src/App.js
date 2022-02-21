import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { combineReducers } from "redux";
import TodoItem from "./components/TodoItem";

export const asyncMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

export const fetchThunk = () => async (dispatch) => {
  dispatch({ type: "PENDING_TODO" });
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    const todos = data.slice(0, 10);
    dispatch({ type: "FULLFILLED_TODO", payload: todos });
  } catch (e) {
    dispatch({ type: "ERROR_TODO", error: e.message });
  }
};

export const filterReducer = (state = "ALL", action) => {
  switch (action.type) {
    case "SET_FILTER":
      return action.payload;
    default:
      return state;
  }
};

const initialFetching = {
  loading: "idle",
  error: null,
};

export const fetchingReducer = (state = initialFetching, action) => {
  switch (action.type) {
    case "PENDING_TODO": {
      return { ...state, loading: "pending" };
    }
    case "FULLFILLED_TODO": {
      return { ...state, loading: "success" };
    }
    case "ERROR_TODO": {
      return { loading: "rejected", error: action.error };
    }
    default:
      return state;
  }
};

export const todosReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO": {
      return state.concat({ ...action.payload });
    }
    case "COMPLETE_TODO": {
      const newTodos = state.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, complete: !todo.complete };
        }
        return todo;
      });
      return newTodos;
    }
    case "FULLFILLED_TODO": {
      return action.payload;
    }
    default:
      return state;
  }
};

export const reducer = combineReducers({
  todos: combineReducers({
    entities: todosReducer,
    status: fetchingReducer,
  }),
  visibilityFilter: filterReducer,
});

const selectTodos = (state) => {
  const {
    todos: { entities },
    visibilityFilter,
  } = state;

  if (visibilityFilter === "COMPLETE") {
    return entities.filter((todo) => todo.complete);
  }
  if (visibilityFilter === "INCOMPLETE") {
    return entities.filter((todo) => !todo.complete);
  }
  return entities;
};

const selectStatus = state => state.todos.status;

const App = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const todos = useSelector(selectTodos);
  const status = useSelector(selectStatus);

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

  if (status.loading === "pending") {
    return <div>Loading...</div>;
  }
  
  if (status.loading === "rejected") {
    return <div>{status.error}</div>;
  }

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
      <button onClick={() => dispatch(fetchThunk())}>Fetch</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default App;
