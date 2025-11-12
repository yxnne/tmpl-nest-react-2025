import { useState } from 'react'
import { Button, Card, Form, Input, message, Space, Typography } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '../api/auth'
import { setToken, parseJwt } from '../auth'
import { useSetAtom } from 'jotai'
import { userAtom } from '../store/user'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/system'
  const setUser = useSetAtom(userAtom)

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true)
      const res = await login(values.username, values.password) as any
      setToken(res.access_token)
      const payload = parseJwt(res.access_token)
      setUser({ username: payload?.username, roles: payload?.roles })
      if (payload?.username) message.success(`欢迎 ${payload.username}`)
      navigate(from, { replace: true })
    } catch (e: any) {
      message.error(e.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Card style={{ width: 360 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Typography.Title level={4} style={{ margin: 0 }}>系统登录</Typography.Title>
          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item name="username" label="用户名/邮箱/手机号" rules={[{ required: true }]}> 
              <Input placeholder="输入邮箱" />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true }]}> 
              <Input.Password placeholder="输入密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>登录</Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  )
}