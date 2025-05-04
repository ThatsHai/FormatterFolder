// App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom"; 
//Ignore spelling warning in the following line
import Router from "./router/Router.jsx"; 

const App = () => {
  return <RouterProvider router={Router}></RouterProvider>;
};

export default App;
