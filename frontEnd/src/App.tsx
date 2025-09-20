import React from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Chat from "./components/chats/chat";
import Home from "./components/home/Home";
import { FeaturesSection } from "./components/home/FeatureSection";
import { AboutSection } from "./components/home/AboutSection";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <div>Chat</div>,
  },
  {
    path: "/features",
    element: <FeaturesSection />,
  },
  {
    path: "/about",
    element: <AboutSection />,
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
