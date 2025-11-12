import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { HomeOutlined, SettingOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import AdminLayout from './layouts/AdminLayout'
import Login from './pages/Login'
import SystemManagement from './pages/SystemManagement'
import UserManagement from './pages/UserManagement'
import RoleManagement from './pages/RoleManagement'

export type RouteItem = {
  path: string
  title: string
  icon?: ReactNode
  element?: ReactNode
  hideInMenu?: boolean
  requireAuth?: boolean
  children?: RouteItem[]
}

export const routes: RouteItem[] = [
  { path: '/login', title: '登录', element: <Login />, hideInMenu: true },
  {
    path: '/',
    title: '首页',
    icon: <HomeOutlined />,
    requireAuth: true,
    element: <AdminLayout />,
    children: [
      {
        path: '/system',
        title: '系统管理',
        icon: <SettingOutlined />,
        element: <SystemManagement />,
        children: [
          { path: '/system/users', title: '用户管理', icon: <UserOutlined />, element: <UserManagement /> },
          { path: '/system/roles', title: '角色管理', icon: <TeamOutlined />, element: <RoleManagement /> },
        ],
      },
    ],
  },
  { path: '*', title: '跳转', hideInMenu: true, element: <Navigate to="/system" replace /> },
]

export const findBestChain = (pathname: string, items: RouteItem[]): RouteItem[] => {
  let best: RouteItem[] = []
  const walk = (nodes: RouteItem[], chain: RouteItem[]) => {
    for (const n of nodes) {
      const match = pathname === n.path || pathname.startsWith(n.path + '/') || (n.path === '/' && pathname === '/')
      if (match) {
        const next = [...chain, n]
        if (next.length > best.length) best = next
        if (n.children) walk(n.children, next)
      }
    }
  }
  walk(items, [])
  return best
}

export const menuRoots = () => {
  const root = routes.find(r => r.path === '/')
  return root?.children?.filter(r => !r.hideInMenu) || []
}