import { configureStore } from "@reduxjs/toolkit";
import authManager from "./auth.manager";
import orderManager from "./order.manager";
const Manager = configureStore({
    reducer: {
        auth: authManager,
        order: orderManager
    }
})
export default Manager;