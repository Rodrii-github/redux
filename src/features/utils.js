export const reduceReducers =
  (...reducers) =>
  (state, action) =>
    reducers.reduce((acc, el) => el(acc, action), state);

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

export const makeCrudReducer =
  (actions) =>
  (state = [], action) => {
    switch (action.type) {
      case actions[0]: {
        return state.concat({ ...action.payload });
      }
      case actions[1]: {
        const newEntities = state.map((entity) => {
          if (entity.id === action.payload.id) {
            return { ...entity, complete: !entity.complete };
          }
          return entity;
        });
        return newEntities;
      }
      default:
        return state;
    }
  };

export const makeActionsCreators =
  (type, ...argNames) =>
  (...args) => {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };

export const makeAsyncTypes = (entity) => [
  `PENDING_${entity}`,
  `FULLFILLED_${entity}`,
  `ERROR_${entity}`,
];

export const asyncMac = (asyncTypes) => [
  makeActionsCreators(asyncTypes[0]),
  makeActionsCreators(asyncTypes[1], "payload"),
  makeActionsCreators(asyncTypes[2], "error"),
];
