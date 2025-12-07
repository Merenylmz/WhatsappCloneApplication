import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { loginFailure, loginSuccess } from './action/action';

function* loginWorker(action: any) : Generator<any, void, any>{
    try {
        const response = yield call(axios.post, "http://localhost:3002/users/login", {email: action.payload.email, password: action.payload.password});
        console.log(response.data);
        
        yield put(loginSuccess(response.data.token, response.data.user));
    } catch (error) {
        yield put(loginFailure(error)); 
    }
}


export default function* rootSaga(){
    yield takeLatest("LOGIN_REQUEST", loginWorker);
}