const initialState = {
    loading: false,
    token: "",
    error: {},
    user: {}
};

export default function rootReducer(state = initialState, action: {payload: any, type: any}) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };

    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, token: action.payload.token, user: action.payload.user };

    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}