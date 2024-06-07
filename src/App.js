import AppProvider from "./context/AppProvider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Layout from "./layout";
import Landing from "./containers/Landing";
import HistoryPage from "./containers/Landing/History";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/history",
        element: <HistoryPage />,
      },
    ],
  },
]);

const App = () => {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppProvider>
  );
};

export default App;
