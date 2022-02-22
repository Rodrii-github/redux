import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  setComplete,
  setFilter,
  fetchThunk,
  selectTodos,
  selectStatus,
} from "./features/todos";
import TodoItem from "./components/TodoItem";

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
      <button onClick={() => dispatch(setFilter("ALL"))}>Mostrar Todos</button>
      <button onClick={() => dispatch(setFilter("COMPLETE"))}>
        Completados
      </button>
      <button onClick={() => dispatch(setFilter("INCOMPLETE"))}>
        Incompletos
      </button>
      <button onClick={() => dispatch(fetchThunk())}>Fetch</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} setComplete={setComplete} />
        ))}
      </ul>
    </div>
  );
};

export default App;
