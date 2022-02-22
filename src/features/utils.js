const initialFetching = {
  loading: "idle",
  error: null,
};

export const makeFetchingReducer =
  (actions) =>
  (state = initialFetching, action) => {
    switch (action.type) {
      case actions[0]: {
        return { ...state, loading: "pending" };
      }
      case actions[1]: {
        return { ...state, loading: "success" };
      }
      case actions[2]: {
        return { loading: "rejected", error: action.error };
      }
      default:
        return state;
    }
  };

export const makeSetReducer =
  (actions) =>
  (state = "ALL", action) => {
    switch (action.type) {
      case actions[0]: {
        return action.payload;
      }
      default:
        return state;
    }
  };
