// App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom"; // Correct import
import router from "./router/router"; // Import the router from the router.js file

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
