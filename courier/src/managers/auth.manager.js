import { createSlice } from "@reduxjs/toolkit";

export const AuthManager = createSlice({
    name: 'auth',
    initialState: {
        refresh: false,
        name: '',
        telegram: '',
        balance: 0,
        phone: '',
        id: ''
    },
    reducers: {
        setRefreshAuth: state => {
            state.refresh = !state.refresh;
        },
        setInfoAuth: (state, { payload }) => {
            const { name, phone, id, balance,telegram } = payload;
            state.name = name;
            state.phone = phone;
            state.telegram = telegram
            state.id = id;
            state.balance = balance;
        }
    },
});
export const { setInfoAuth, setRefreshAuth } = AuthManager.actions
export default AuthManager.reducer