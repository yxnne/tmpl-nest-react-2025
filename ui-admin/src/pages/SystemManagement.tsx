import { Tabs, Typography, Space } from 'antd'
import UserManagement from './UserManagement'
import RoleManagement from './RoleManagement'

export default function SystemManagement() {
  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Typography.Title level={4} style={{ margin: 0 }}>系统管理</Typography.Title>
        <Tabs
          defaultActiveKey="users"
          items={[
            { key: 'users', label: '用户管理', children: <UserManagement /> },
            { key: 'roles', label: '角色管理', children: <RoleManagement /> },
          ]}
        />
      </Space>
    </div>
  )
}