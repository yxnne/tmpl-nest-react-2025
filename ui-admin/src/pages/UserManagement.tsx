import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, Input, Modal, Select, Space, Table, message, Popconfirm } from 'antd'
import { getRoles } from '../api/role'
import { createUser, deleteUser, getUsers, setUserRole, updateUser } from '../api/user'
import type { Role, User } from '../api/types'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [expanded, setExpanded] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [total, setTotal] = useState(0)

  const roleOptions = useMemo(() => roles.map(r => ({ label: r.name, value: r.id })), [roles])

  const load = async (p = page, s = pageSize) => {
    setLoading(true)
    try {
      const q = searchForm.getFieldsValue()
      const [uRes, rRes] = await Promise.all([getUsers(p, s, q), getRoles(1, 100)])
      setUsers(uRes.items)
      setTotal(uRes.total)
      setPage(uRes.page)
      setPageSize(uRes.pageSize)
      setRoles(rRes.items)
    } catch (e: any) {
      message.error(e.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onCreate = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }
  const onEdit = (u: User) => {
    setEditing(u)
    form.setFieldsValue({ name: u.name, email: u.email, roleId: u.roleId })
    setOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing) {
        const payload: any = { name: values.name, email: values.email }
        if (values.password) payload.password = values.password
        await updateUser(editing.id, payload)
        if (values.roleId !== undefined) await setUserRole(editing.id, values.roleId)
        message.success('更新成功')
      } else {
        await createUser({ name: values.name, email: values.email, password: values.password })
        message.success('创建成功')
      }
      setOpen(false)
      await load()
    } catch (e: any) {
      if (e?.errorFields) return
      message.error(e.message || '提交失败')
    }
  }

  const onDelete = async (u: User) => {
    try {
      await deleteUser(u.id)
      message.success('删除成功')
      await load()
    } catch (e: any) {
      message.error(e.message || '删除失败')
    }
  }

  const filtered = users

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '姓名', dataIndex: 'name' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '手机号', dataIndex: 'phone' },
    { title: '角色', dataIndex: 'roleId', render: (v: number) => roles.find(r => r.id === v)?.name || '-' },
    {
      title: '操作',
      width: 200,
      render: (_: any, u: User) => (
        <Space>
          <Button size="small" type="link" onClick={() => onEdit(u)}>编辑</Button>
          <Popconfirm title="确认删除该用户?" onConfirm={() => onDelete(u)}>
            <Button size="small" type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  }

  const batchDelete = async () => {
    try {
      for (const id of selectedRowKeys as number[]) {
        await deleteUser(id)
      }
      message.success('批量删除成功')
      setSelectedRowKeys([])
      await load()
    } catch (e: any) {
      message.error(e.message || '批量删除失败')
    }
  }

  return (
    <Card bordered={false} style={{ background: '#fff' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Space style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>用户管理</span>
          </Space>
          <Form form={searchForm} layout="inline" onFinish={() => { setPage(1); load(1, pageSize) }}>
            <Form.Item name="name" label="姓名"><Input allowClear placeholder="输入姓名" /></Form.Item>
            <Form.Item name="email" label="邮箱"><Input allowClear placeholder="输入邮箱" /></Form.Item>
            <Form.Item name="roleId" label="角色"><Select allowClear options={roleOptions} style={{ minWidth: 120 }} placeholder="选择角色" /></Form.Item>
            {expanded && (
              <>
                <Form.Item name="phone" label="手机号"><Input allowClear placeholder="输入手机号" /></Form.Item>
                <Form.Item name="id" label="ID"><Input allowClear placeholder="精确匹配" /></Form.Item>
              </>
            )}
            <Space>
              <Button type="primary" onClick={() => searchForm.submit?.()}>查询</Button>
              <Button onClick={() => { searchForm.resetFields(); setPage(1); load(1, pageSize) }}>重置</Button>
              <Button onClick={() => setExpanded(!expanded)}>{expanded ? '收起' : '展开'}</Button>
            </Space>
          </Form>
        </div>

        <Space>
          <Button type="primary" onClick={onCreate}>新建</Button>
          <Button onClick={() => load()}>刷新</Button>
          <Popconfirm title="确认批量删除选中用户?" onConfirm={batchDelete} disabled={!selectedRowKeys.length}>
            <Button danger disabled={!selectedRowKeys.length}>批量删除</Button>
          </Popconfirm>
        </Space>

        <Alert type="info" showIcon message={<span>已选择: {selectedRowKeys.length} 项</span>} />

      <div style={{ height: 'calc(100vh - 320px)' }}>
        <Table
          rowKey="id"
          sticky
          loading={loading}
          dataSource={filtered}
          columns={columns as any}
            pagination={{ current: page, pageSize, total, showSizeChanger: true }}
          size="small"
          rowSelection={rowSelection as any}
          scroll={{ y: 'calc(100vh - 420px)' }}
          onChange={(p) => { setPage(p.current || 1); setPageSize(p.pageSize || 15); load(p.current || 1, p.pageSize || 15) }}
        />
      </div>
      </Space>

      <Modal open={open} title={editing ? '编辑用户' : '新增用户'} onOk={onSubmit} onCancel={() => setOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}> 
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}> 
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="password" label={editing ? '新密码' : '密码'} rules={editing ? [] : [{ required: true, min: 6 }]}>
            <Input.Password placeholder={editing ? '可留空不修改' : '至少 6 位'} />
          </Form.Item>
          <Form.Item name="roleId" label="角色">
            <Select allowClear options={roleOptions} placeholder="选择角色" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}