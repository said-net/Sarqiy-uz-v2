import { configureStore } from "@reduxjs/toolkit";
import refreshManager from "./refresh.manager";
import authManager from "./auth.manager";
const Manager = configureStore({
    reducer: {
        refresh: refreshManager,
        auth: authManager
    }
})
export default Manager;