import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboradLayout";
import AuthLayout from "../layouts/AuthLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Auth/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Auth/Register";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            { index: true, element: <Navigate to="login" replace /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
        ],
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { index: true, element: <Dashboard /> },
        ],
    },
    { path: "*", element: <NotFound /> },
]);

export default router;
