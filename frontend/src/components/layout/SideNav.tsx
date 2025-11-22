import React, { useState, useCallback, useEffect } from 'react'
import { appRoutes } from '../../routes/appRoutes'
import { motion } from 'motion/react'
import Cookies from 'js-cookie'
import { Power } from 'lucide-react'

const SideNav: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<string>('')

  useEffect(() => {
    const currentPath = location.pathname
    let nextRoute = activeRoute

    if (currentPath.startsWith(appRoutes.masterRoutes.children.users)) {
      nextRoute = appRoutes.masterRoutes.children.users
    } else if (currentPath.startsWith('/master')) {
      nextRoute = appRoutes.masterRoutes.master
    } else if (currentPath.startsWith('/stock-management')) {
      nextRoute = appRoutes.stockManagement
    } else if (currentPath.startsWith('/dashboard')) {
      nextRoute = appRoutes.dashboard
    } else if (currentPath.startsWith('/delivery')) {
      nextRoute = appRoutes.delivery
    } else if (currentPath.startsWith('/internal-transfer')) {
      nextRoute = appRoutes.internalTransfer
    }

    if (nextRoute !== activeRoute) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveRoute(nextRoute)
    }
  }, [location.pathname, activeRoute])

  const navigateToRoute = useCallback((route: string) => {
    setActiveRoute(route)
    window.history.pushState({}, '', route)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  const isRouteActive = (route: string): boolean => activeRoute === route

  const handleLogout = () => {
    Cookies.remove('token')
    localStorage.clear()
    navigateToRoute(appRoutes.signIn)
  }

  return (
    <div
      style={{ zoom: 0.85 }}
      className={`floating-container bg:white relative flex h-full border-r-2 border-gray-200 shadow-sm transition-all duration-300`}
    >
      <motion.section
        className={`flex h-full flex-col justify-between bg-white transition-all duration-300`}
        animate={{ x: 0, opacity: 1 }}
      >
        {/* MAIN NAVIGATION */}
        <motion.div
          className="main-navigation-items flex flex-col items-center px-1.5 pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex h-full flex-col gap-3 overflow-y-auto">
            <NavigationButton
              labelName="Dashboard"
              isActive={isRouteActive(appRoutes.dashboard)}
              iconSrc="/icons/sideNavIcons/dashboard-icon.svg"
              activeIconSrc="/icons/sideNavIcons/dashboard-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.dashboard)}
            />

            <NavigationButton
              labelName="Master"
              isActive={isRouteActive(appRoutes.masterRoutes.master)}
              iconSrc="/icons/sideNavIcons/master-icon.svg"
              activeIconSrc="/icons/sideNavIcons/master-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.masterRoutes.master)}
            />
            <NavigationButton
              labelName="Users"
              isActive={isRouteActive(appRoutes.masterRoutes.children.users)}
              iconSrc="/icons/sideNavIcons/users-icon.svg"
              activeIconSrc="/icons/sideNavIcons/users-icon-active.svg"
              onClick={() =>
                navigateToRoute(appRoutes.masterRoutes.children.users)
              }
            />

            <NavigationButton
              labelName="Stock"
              isActive={isRouteActive(appRoutes.stockManagement)}
              iconSrc="/icons/sideNavIcons/approval-icon.svg"
              activeIconSrc="/icons/sideNavIcons/approval-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.stockManagement)}
            />

            <NavigationButton
              labelName="Delivery"
              isActive={isRouteActive(appRoutes.delivery)}
              iconSrc="/icons/sideNavIcons/approval-icon.svg"
              activeIconSrc="/icons/sideNavIcons/approval-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.delivery)}
            />

            <NavigationButton
              labelName="Transfer"
              isActive={isRouteActive(appRoutes.internalTransfer)}
              iconSrc="/icons/sideNavIcons/memo-icon.svg"
              activeIconSrc="/icons/sideNavIcons/memo-icon-active.svg"
              onClick={() => navigateToRoute(appRoutes.internalTransfer)}
            />
          </div>
        </motion.div>

        {/* LOGOUT BUTTON USING UNICODE */}
        <motion.div
          className="mb-8 flex flex-col items-center select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <button
            onClick={handleLogout}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-all hover:bg-red-50"
          >
            <Power className="h-7 w-7 text-red-600 hover:text-red-700" />
            <span className="mt-1 text-sm font-medium text-red-600">
              Logout
            </span>
          </button>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default SideNav

// -------------------------------
// Navigation Button Component
// -------------------------------

interface NavigationButtonProps {
  labelName: string
  isActive: boolean
  iconSrc: string
  activeIconSrc?: string
  onClick?: () => void
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  labelName,
  isActive,
  iconSrc,
  activeIconSrc,
  onClick,
}) => {
  return (
    <div
      className="Navigation-button-container flex scale-95 cursor-pointer flex-col items-center justify-center"
      onClick={onClick}
    >
      <div
        className={`Navigation-button-container ${
          isActive
            ? 'bg-blue-500 p-4 dark:bg-blue-400'
            : 'bg-white p-2.5 hover:bg-slate-100'
        } cursor-pointer rounded-[12px] transition-all duration-300 ease-in-out select-none`}
      >
        <img
          className="url h-7 w-7"
          src={isActive ? activeIconSrc : iconSrc}
          alt={labelName}
        />
      </div>

      <h4
        className={`mt-1.5 text-[0.9rem] ${
          isActive ? 'font-medium text-slate-800' : 'font-medium text-slate-500'
        }`}
      >
        {labelName}
      </h4>
    </div>
  )
}
