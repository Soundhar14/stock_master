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
import StockManagementPage from './pages/StockManagementPage'

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
              element={<h1 className="p-4 text-2xl font-bold">Dashboard</h1>}
            />

            {/* Master page  */}

            <Route
              path={appRoutes.masterRoutes.master}
              element={<MasterPage />}
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
            {/* Stock managment page */}
            <Route
              path={appRoutes.stockManagement}
              element={<StockManagementPage />}
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
