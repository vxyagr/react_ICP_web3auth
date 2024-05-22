import AppProvider from "./context/AppProvider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Layout from "./layout";
import Landing from "./containers/Landing";
import Migrate from "./containers/Migrate";
import MigrateICP from "./containers/MigrateICP";
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
        path: "/migrate",
        element: <Migrate />,
      },
      {
        path: "/migrateicp",
        element: <MigrateICP />,
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
