import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Spinner from './components/common/Spinner'
import { appRoutes } from './routes/appRoutes'
import { SignInPage } from './pages/SignInPage'
import ProtectedRoute from './components/layout/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import { ErrorPageContent } from './pages/ErrorPage'
import ProductPage from './pages/MasterPages/Product/ProductPage'
import WarehousesPage from './pages/MasterPages/Warehouse/WarehousePage'
import MasterPage from './pages/MasterPages/MasterPage'
import CategoriesPage from './pages/MasterPages/Category/CategoryPage'
import UsersPage from './pages/MasterPages/Users/UsersPage'
import StockManagementPage from './pages/StockManagementPage'
import DeliveryPage from './pages/DeliveryPage'
import CreateDeliveryPage from './pages/delivery/CreateDeliveryPage'
import OperationsDashboard from './pages/Dashboard'
import InternalMovePage from './pages/InternalDelivery'

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <Routes>
        {/* Auth Route */}
        <Route path={appRoutes.signIn} element={<SignInPage />} />

        {/* Redirect root to dashboard */}
        <Route
          path="/"
          element={<Navigate to={appRoutes.dashboard} replace />}
        />

        {/* Protected main routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path={appRoutes.dashboard}
              element={<OperationsDashboard />}
            />

            {/* Master page  */}

            <Route
              path={appRoutes.masterRoutes.master}
              element={<MasterPage />}
            />

            <Route
              path={appRoutes.internalTransfer}
              element={<InternalMovePage />}
            />

            <Route
              path={appRoutes.masterRoutes.children.warehouse}
              element={<WarehousesPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.Category}
              element={<CategoriesPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.products}
              element={<ProductPage />}
            />
            <Route
              path={appRoutes.masterRoutes.children.users}
              element={<UsersPage />}
            />
            {/* Stock managment page */}
            <Route
              path={appRoutes.stockManagement}
              element={<StockManagementPage />}
            />
            {/* Delivery managment page */}
            <Route path={appRoutes.delivery} element={<DeliveryPage />} />
            <Route
              path={appRoutes.deliveryCreate}
              element={<CreateDeliveryPage />}
            />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={
            <ErrorPageContent
              error={new Error('Page Not Found: 404')}
              onRefresh={() => window.location.reload()}
            />
          }
        />
      </Routes>
    </Suspense>
  )
}
