import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { AuthProvider } from "./contexts/AuthContext";
import store from "./redux/store";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </Provider>
  // </React.StrictMode>
);
