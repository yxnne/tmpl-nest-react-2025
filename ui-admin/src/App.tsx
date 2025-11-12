import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { getToken } from './auth'
import { routes, type RouteItem } from './routes'

const RequireAuth = ({ children }: { children?: React.ReactNode }) => {
  const token = getToken()
  const location = useLocation()
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />
  return <>{children || <Outlet />}</>
}

const renderRoutes = (items: RouteItem[]) => {
  return items.map((item) => {
    const children = item.children ? renderRoutes(item.children) : undefined
    const base = item.element || <Outlet />
    const element = item.requireAuth ? <RequireAuth>{base}</RequireAuth> : base
    return (
      <Route key={item.path} path={item.path} element={element}>
        {children}
      </Route>
    )
  })
}

export default function App() {
  return (
    <Routes>
      {renderRoutes(routes)}
    </Routes>
  )
}
