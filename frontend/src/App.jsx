import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";

function App() {
  const routesConfig = [
    {
      path: "history",
      element: <div>Under Construction...</div>,
      roles: ["Admin"],
    },
    { path: "users", element: <Users />, roles: ["Admin"] },
    {
      path: "",
      element: <Tasks />,
      roles: ["Admin", "Manager", "Employee", "QA"],
    },
  ];

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {routesConfig.map(({ path, element, roles }) => (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoute roles={roles}>{element}</ProtectedRoute>}
            />
          ))}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
