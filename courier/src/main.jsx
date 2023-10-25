import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import Manager from "./managers/managers";
import { BrowserRouter } from "react-router-dom";
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function (registration) {
      console.log('Service worker registered:', registration);
    })
    .catch(function (error) {
      console.log('Service worker registration failed:', error);
    });
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ThemeProvider>
      <Provider store={Manager}>
        <BrowserRouter>
          <App /></BrowserRouter>
      </Provider>
    </ThemeProvider>
  </>,
);
