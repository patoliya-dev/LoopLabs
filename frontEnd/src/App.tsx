import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Chat from "./components/chats/chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
