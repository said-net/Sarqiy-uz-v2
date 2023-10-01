import { createSlice } from "@reduxjs/toolkit";

export const AuthManager = createSlice({
    name: 'auth',
    initialState: {
        refresh: false,
        name: '',
        phone: '',
        image: '',
        owner: false,
        id: ''
    },
    reducers: {
        setRefreshAuth: state => {
            state.refresh = !state.refresh;
        },
        setInfoAuth: (state, { payload }) => {
            const { name, phone, image, id, owner } = payload;
            state.name = name;
            state.phone = phone;
            state.image = image;
            state.id = id;
            state.owner = owner
        }
    },
});
export const { setInfoAuth, setRefreshAuth } = AuthManager.actions
export default AuthManager.reducer