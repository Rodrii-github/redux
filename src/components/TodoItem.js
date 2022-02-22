import { useDispatch } from "react-redux";

const TodoItems = ({ todo, setComplete }) => {
  const dispatch = useDispatch();
  return (
    <li
      style={{ textDecoration: todo.complete ? "line-through" : "none" }}
      onClick={() => dispatch(setComplete(todo))}
    >
      {todo.title}
    </li>
  );
};

export default TodoItems;
