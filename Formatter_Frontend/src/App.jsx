// App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
//Ignore spelling warning in the following line
import Router from "./router/Router.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";

const App = () => {
  // return <RouterProvider router={Router}></RouterProvider>;
  return (
    <Provider store={store}>
      <RouterProvider router={Router} />
    </Provider>
  );
};

export default App;
