import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import Manager from "./managers/managers";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ThemeProvider>
      <Provider store={Manager}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </>,
);
