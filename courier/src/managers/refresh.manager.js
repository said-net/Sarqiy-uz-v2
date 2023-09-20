import { createSlice } from "@reduxjs/toolkit/dist";

const refreshManager = createSlice({
    name: 'refresh',
    initialState: {
        refresh: false
    },
    reducers: {
        setRefresh: state => {
            state.refresh = !state.refresh;
        }
    }
});
export const { setRefresh } = refreshManager.actions;
export default refreshManager.reducer