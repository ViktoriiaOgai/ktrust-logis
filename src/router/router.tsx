
import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/client/HomePage";
import TrackingPage from "@/pages/client/TrackingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AdminHomePage from "@/pages/admin/AdminHomePage";
import DashboardPage from "@/pages/admin/DashboardPage";
import OrdersPage from "@/pages/admin/OrdersPage";
import OrderDetailsPage from "@/pages/admin/OrderDetailsPage";
import UsersPage from "@/pages/admin/UsersPage";
import CustomersPage from "@/pages/admin/CustomersPage";
import CreateOrderPage from "@/pages/client/CreateOrderPage";
import AirDeliveryPage from "@/pages/client/Services/AirDeliveryPage";
import ContainerDeliveryPage from "@/pages/client/Services/ContainerDeliveryPage";
import PersonalDeliveryPage from "@/pages/client/Services/PersonalDeliveryPage";
import OfficialDeliveryPage from "@/pages/client/Services/OfficialDeliveryPage";
import CarDeliveryPage from "@/pages/client/Services/CarDeliveryPage";
import B2BPage from "@/pages/client/Services/B2BPage";
import RootLayout from "@/components/layouts/RootLayout";
import AboutPage from "@/pages/client/Abouts/AboutPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";
import AccessDeniedPage from "@/pages/error/AccessDeniedPage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import OperatorDashboard from "@/pages/operator/OperatorDashboard";
import CourierDashboard from "@/pages/courier/CourierDashboard";

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
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <DashboardPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/operator",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Operator']}>
              <OperatorDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <AdminHomePage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <DashboardPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/courier",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Courier']}>
              <CourierDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Operator', 'Courier']}>
              <OrdersPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/:id",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Operator', 'Courier']}>
              <OrderDetailsPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <OrdersPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders/:id",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <OrderDetailsPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <UsersPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/customers",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <CustomersPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/create-order",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <CreateOrderPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <UsersPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/customers",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Operator']}>
              <CustomersPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-order",
        element: (
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Operator']}>
              <CreateOrderPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        ),
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
      {
        path: "/abouts/about",
        element: <AboutPage />,
      },
      {
        path: "/access-denied",
        element: <AccessDeniedPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);