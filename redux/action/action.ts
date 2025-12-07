const loginRequest = (email: string, password: string) =>({
    type: "LOGIN_REQUEST",
    payload: {email, password}
});


const loginSuccess = (token: string, user: object) =>({
    type: "LOGIN_SUCCESS",
    payload: {token, user}
});


const loginFailure = (error: any) =>({
    type: "LOGIN_FAILURE",
    payload: error
});

export { loginFailure, loginRequest, loginSuccess };

