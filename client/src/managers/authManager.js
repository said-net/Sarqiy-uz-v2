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
        location: '',
        hold_balance: 0,
        coins: 0,
    },
    reducers: {
        setRefreshAuth: state => {
            state.refresh = !state.refresh;
        },
        setInformations: (state, { payload }) => {
            const { name, phone, id, role, created, balance, telegram, location, uId, hold_balance, coins } = payload;
            state.name = name;
            state.phone = phone;
            state.role = role;
            state.id = id;
            state.created = created;
            state.balance = balance;
            state.telegram = telegram;
            state.location = location;
            state.uId = uId;
            state.hold_balance = hold_balance;
            state.coins = coins;
        }
    }
});
export const { setInformations, setRefreshAuth } = AuthManager.actions;
export default AuthManager.reducer