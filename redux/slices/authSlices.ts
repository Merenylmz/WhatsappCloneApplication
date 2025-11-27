import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: "",
}
const authSlices = createSlice({
    name: "authentication",
    initialState: initialState,
    reducers: {
        login: (state, action)=>{
            state.token = action.payload.token;
        },
        logout: (state, action)=>{
            state = initialState;
        }
    }
});


export default authSlices.reducer;
export const login = authSlices.actions.login;
export const logout = authSlices.actions.logout;