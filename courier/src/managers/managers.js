import { configureStore } from "@reduxjs/toolkit";
import authManager from "./auth.manager";
import refreshManager from "./refresh.manager";
const Manager = configureStore({
    reducer: {
        auth: authManager,
        refresh: refreshManager
    }
})
export default Manager;