import { createSlice } from "@reduxjs/toolkit";

const AuthManager = createSlice({
    name: 'auth',
    initialState: {
        uId: '',
        refresh: false,
        name: '',
        phone: '',
        id: '',
        role: '',
        created: '',
        balance: 0,
        telegram: 0,
        location: ''
    },
    reducers: {
        setRefreshAuth: state => {
            state.refresh = !state.refresh;
        },
        setInformations: (state, { payload }) => {
            const { name, phone, id, role, created, balance, telegram, location, uId } = payload;
            state.name = name;
            state.phone = phone;
            state.role = role;
            state.id = id;
            state.created = created;
            state.balance = balance;
            state.telegram = telegram;
            state.location = location;
            state.uId = uId
        }
    }
});
export const { setInformations, setRefreshAuth } = AuthManager.actions;
export default AuthManager.reducer