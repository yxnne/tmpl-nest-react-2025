import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Form, Input, Modal, Space, Table, message, Popconfirm } from 'antd'
import { createRole, deleteRole, getRoles, updateRole } from '../api/role'
import type { Role } from '../api/types'

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [expanded, setExpanded] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [total, setTotal] = useState(0)

  const load = async (p = page, s = pageSize) => {
    setLoading(true)
    try {
      const q = searchForm.getFieldsValue()
      const rRes = await getRoles(p, s, q)
      setRoles(rRes.items)
      setTotal(rRes.total)
      setPage(rRes.page)
      setPageSize(rRes.pageSize)
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
  const onEdit = (r: Role) => {
    setEditing(r)
    form.setFieldsValue({ name: r.name, description: r.description })
    setOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editing) {
        await updateRole(editing.id, values)
        message.success('更新成功')
      } else {
        await createRole(values)
        message.success('创建成功')
      }
      setOpen(false)
      await load()
    } catch (e: any) {
      if (e?.errorFields) return
      message.error(e.message || '提交失败')
    }
  }

  const onDelete = async (r: Role) => {
    try {
      await deleteRole(r.id)
      message.success('删除成功')
      await load()
    } catch (e: any) {
      message.error(e.message || '删除失败')
    }
  }

  const filtered = roles

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'description' },
    {
      title: '操作',
      width: 200,
      render: (_: any, r: Role) => (
        <Space>
          <Button size="small" type="link" onClick={() => onEdit(r)}>编辑</Button>
          <Popconfirm title="确认删除该角色?" onConfirm={() => onDelete(r)}>
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
        await deleteRole(id)
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
            <span style={{ fontSize: 18, fontWeight: 600 }}>角色管理</span>
          </Space>
          <Form form={searchForm} layout="inline" onFinish={() => { setPage(1); load(1, pageSize) }}>
            <Form.Item name="name" label="名称"><Input allowClear placeholder="输入角色名称" /></Form.Item>
            {expanded && (
              <Form.Item name="description" label="描述"><Input allowClear placeholder="输入描述" /></Form.Item>
            )}
            {expanded && (<Form.Item name="id" label="ID"><Input allowClear placeholder="精确匹配" /></Form.Item>)}
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
          <Popconfirm title="确认批量删除选中角色?" onConfirm={batchDelete} disabled={!selectedRowKeys.length}>
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

      <Modal open={open} title={editing ? '编辑角色' : '新增角色'} onOk={onSubmit} onCancel={() => setOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}> 
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="description" label="描述"> 
            <Input placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}