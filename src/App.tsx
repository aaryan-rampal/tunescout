// import {
//   Route,
//   RouterProvider,
//   createBrowserRouter,
//   createRoutesFromElements,
// } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import Callback from "./pages/Callback";
// import Dashboard from "./pages/Dashboard";
// import Home from "./pages/Home";
// import RootLayout from "./layouts/Layout";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<RootLayout />}>
//       <Route path="/" element={<Home />} />
//       <Route path="/callback" element={<Callback />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//     </Route>
//   ),
//   {
//     basename: "/tunescout"
//   }
// );

// const queryClient = new QueryClient();

// const App = () => {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <RouterProvider router={router} />
//     </QueryClientProvider>
//   );
// };

// export default App;

import {
  Route,
  Routes,
  HashRouter
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import RootLayout from "./layouts/Layout";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="callback" element={<Callback />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
