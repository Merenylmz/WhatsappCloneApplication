import { configureStore } from "@reduxjs/toolkit";
import authSlices from "./slices/authSlices";

const store = configureStore({
    reducer: {
        auth: authSlices
    }
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;