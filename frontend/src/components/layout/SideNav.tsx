import React, { useState, useCallback, useEffect } from 'react'
import { appRoutes } from '../../routes/appRoutes'
import { motion } from 'motion/react'

const SideNav: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<string>('')

  useEffect(() => {
    const currentPath = location.pathname

    if (currentPath.startsWith('/master')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveRoute(appRoutes.masterRoutes.master)
    } else if (currentPath.startsWith('/stock-management')) {
      setActiveRoute(appRoutes.stockManagement)
    } else if (currentPath.startsWith('/dashboard')) {
      setActiveRoute(appRoutes.dashboard)
    } else if (currentPath.startsWith('/delivery')) {
      setActiveRoute(appRoutes.delivery)
    }
  }, [location.pathname])

  const navigateToRoute = useCallback((route: string) => {
    setActiveRoute(route)
    window.history.pushState({}, '', route)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  const isRouteActive = (route: string): boolean => {
    return activeRoute === route
  }

  return (
    <div
      style={{ zoom: 0.85 }}
      className={`floating-container bg:white relative flex h-screen border-r-2 border-gray-200 shadow-sm transition-all duration-300`}
    >
      <motion.section
        className={`flex h-screen flex-col items-center justify-center gap-3 overflow-clip bg-white transition-all duration-300 select-none`}
        animate={{ x: 0, opacity: 1 }}
      >
        <motion.div
          className="main-navigation-items flex h-full flex-col items-center justify-center px-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col gap-3 overflow-y-auto">
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
  labelName=" Transfer"
  isActive={isRouteActive(appRoutes.internalTransfer)}
  iconSrc="/icons/sideNavIcons/memo-icon.svg"
  activeIconSrc="/icons/sideNavIcons/memo-icon-active.svg"
  onClick={() => navigateToRoute(appRoutes.internalTransfer)}
/>

          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default SideNav

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
      className="Navigation-button-container flex scale-90 flex-col items-center justify-center"
      onClick={onClick}
    >
      <div
        className={`Navigation-button-container ${isActive ? 'bg-blue-500 p-3 dark:bg-blue-400' : 'bg-white p-1.5 hover:bg-slate-100'} cursor-pointer rounded-[10px] transition-all duration-300 ease-in-out select-none`}
      >
        <img
          className="url"
          src={isActive ? activeIconSrc : iconSrc}
          alt={labelName}
        />
      </div>
      <h4
        className={`scale-95 text-sm ${isActive ? 'font-medium text-slate-800' : 'font-medium text-slate-500'}`}
      >
        {labelName}
      </h4>
    </div>
  )
}
