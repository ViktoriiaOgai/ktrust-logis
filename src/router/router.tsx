
import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/client/HomePage";
import TrackingPage from "@/pages/client/TrackingPage";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import OrderDetailsPage from "@/pages/admin/OrderDetailsPage";
import CreateOrderPage from "@/pages/client/CreateOrderPage";
import AirDeliveryPage from "@/pages/client/Services/AirDeliveryPage";
import ContainerDeliveryPage from "@/pages/client/Services/ContainerDeliveryPage";
import PersonalDeliveryPage from "@/pages/client/Services/PersonalDeliveryPage";
import OfficialDeliveryPage from "@/pages/client/Services/OfficialDeliveryPage";
import CarDeliveryPage from "@/pages/client/Services/CarDeliveryPage";
import B2BPage from "@/pages/client/Services/b2bPage";
import RootLayout from "@/components/layouts/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
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
        element: <AirDeliveryPage />,
      },
      {
        path: "/services/container",
        element: <ContainerDeliveryPage />,
      },
      {
        path: "/services/personal",
        element: <PersonalDeliveryPage />,
      },
      {
        path: "/services/official",
        element: <OfficialDeliveryPage />,
      },
      {
        path: "/services/carexport",
        element: <CarDeliveryPage />,
      },
      {
        path: "/services/b2b",
        element: <B2BPage />,
      },
    ],
  },
]);