import { Layout, Menu, Typography, Space, Avatar, Dropdown, Breadcrumb } from 'antd'
import { UserOutlined, LogoutOutlined, AppstoreOutlined, MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearToken, getToken, parseJwt } from '../auth'
import { useState } from 'react'
import { routes, menuRoots, findBestChain, type RouteItem } from '../routes'
import { useAtom } from 'jotai'
import { userAtom } from '../store/user'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user] = useAtom(userAtom)
  const token = getToken()
  const payload = parseJwt(token)
  const username = user?.username || payload?.username || '未登录'
  const [collapsed, setCollapsed] = useState(false)

  const roots = menuRoots()
  const toMenuItems = (nodes: RouteItem[]): any[] => nodes.map(n => ({
    key: n.path,
    icon: n.icon,
    label: <Link to={n.path}>{n.title}</Link>,
    children: n.children ? toMenuItems(n.children.filter(c => !c.hideInMenu)) : undefined,
  }))
  const menuItems = toMenuItems(roots)
  const chain = findBestChain(location.pathname, routes)
  const openParentKeys = chain.slice(0, -1).map(n => n.path)

  const onLogout = () => {
    clearToken()
    navigate('/login', { replace: true })
  }

  const menu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: onLogout },
    ],
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={208} theme="light">
        <div style={{ height: 48, display: 'flex', alignItems: 'center', padding: '0 16px', fontWeight: 600 }}>{collapsed ? '菜单' : '导航菜单'}</div>
        <Menu selectedKeys={[location.pathname]} openKeys={openParentKeys} items={menuItems as any} mode="inline" />
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: '#fff' }}>
          <Space>
            <span onClick={() => setCollapsed(!collapsed)} style={{ cursor: 'pointer', fontSize: 18 }}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Typography.Title level={5} style={{ margin: 0 }}>系统名称</Typography.Title>
          </Space>
          <Dropdown menu={menu} trigger={[ 'click' ]}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size={24} icon={<UserOutlined />} />
              {username}
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <Breadcrumb items={chain.map(n => ({ title: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{n.icon}{n.title}</span> }))} />
          </div>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}