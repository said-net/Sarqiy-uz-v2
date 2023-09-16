import { configureStore } from "@reduxjs/toolkit";
import AuthManager from "./authManager";
import ChatManager from "./chatManager";

const manager = configureStore({
    reducer: {
        auth: AuthManager,
        chat: ChatManager
    }
});
export default manager;