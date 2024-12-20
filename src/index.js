import React, { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import Store from "./Context/Store/Store";

// Store.subscribe(() => console.log(Store.getState()));
const Root = () => {
  // Memoize the store instance to avoid unnecessary re-renders
  const value = useMemo(() => Store, []);

  return (
    <Provider store={value}>
      <App />
    </Provider>
  );
};

// Create the root element and render the application
const root = ReactDOM.createRoot(document.getElementById("root")); // Ensure there's an element with id="root" in your index.html
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
