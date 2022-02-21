import { useDispatch } from "react-redux";

const TodoItems = ({ todo }) => {
  const dispatch = useDispatch();
  return (
    <li
      style={{ textDecoration: todo.complete ? "line-through" : "none" }}
      onClick={() => dispatch({ type: "COMPLETE_TODO", payload: todo })}
    >
      {todo.title}
    </li>
  );
};

export default TodoItems;
