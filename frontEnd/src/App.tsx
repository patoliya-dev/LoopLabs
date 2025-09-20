import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
  {
    path: "/chat",
    element: <div>Chat</div>,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
