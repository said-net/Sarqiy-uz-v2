import { createSlice } from "@reduxjs/toolkit/dist";

const OrderManager = createSlice({
    name: 'order',
    initialState: {
        refresh: false
    },
    reducers: {
        setRefreshOrders: state => {
            state.refresh = !state.refresh;
        }
    }
});
export const { setRefreshOrders } = OrderManager.actions;
export default OrderManager.reducer