import { createSlice } from "@reduxjs/toolkit";

const ChatManager = createSlice({
    name: 'chat',
    initialState: {
        refresh: false,
    },
    reducers: {
        setRefreshChat: state => {
            state.refresh = !state.refresh;
        },
    }
});
export const { setRefreshChat } = ChatManager.actions;
export default ChatManager.reducer