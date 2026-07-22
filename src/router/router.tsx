
import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/client/HomePage";
import TrackingPage from "@/pages/client/TrackingPage";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import OrderDetailsPage from "@/pages/admin/OrderDetailsPage";
import CreateOrderPage from "@/pages/client/CreateOrderPage";
import AirDeliveryPage from "@/pages/client/Services/AirDeliveryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/tracking",
    element: <TrackingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/orders/:id",
    element: <OrderDetailsPage />,
  },
  {
    path: "/create-order",
    element: <CreateOrderPage />,
  },
  {
    path: "/services/air",
    element: <AirDeliveryPage/>,
  },
]);
