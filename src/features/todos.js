import { combineReducers } from "redux";
import {
  makeFetchingReducer,
  makeSetReducer,
  reduceReducers,
  makeCrudReducer,
} from "./utils";

export const setPending = () => {
  return {
    type: "PENDING_TODO",
  };
};

export const setFulfilled = (payload) => ({ type: "FULLFILLED_TODO", payload });

export const setError = (e) => ({ type: "ERROR_TODO", error: e.message });

export const setComplete = (payload) => ({ type: "COMPLETE_TODO", payload });

export const setFilter = (payload) => ({ type: "SET_FILTER", payload });

export const fetchThunk = () => async (dispatch) => {
  dispatch(setPending());
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    const todos = data.slice(0, 10);
    dispatch(setFulfilled(todos));
  } catch (e) {
    dispatch(setError());
  }
};

export const filterReducer = makeSetReducer(["SET_FILTER"]);

export const fetchingReducer = makeFetchingReducer([
  "PENDING_TODO",
  "FULLFILLED_TODO",
  "ERROR_TODO",
]);

const fullFilledReducer = makeSetReducer(["FULLFILLED_TODO"]);

const crudReducer = makeCrudReducer(["ADD_TODO", "COMPLETE_TODO"]);

export const todosReducer = reduceReducers(crudReducer, fullFilledReducer);

export const reducer = combineReducers({
  todos: combineReducers({
    entities: todosReducer,
    status: fetchingReducer,
  }),
  visibilityFilter: filterReducer,
});

export const selectTodos = (state) => {
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

export const selectStatus = (state) => state.todos.status;
