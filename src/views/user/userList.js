import React, { Component } from 'react'
import { Table, Divider, Button, Input, message, Popconfirm } from 'antd'

import { httpRequest } from '../../utils/httpRequest'


class User extends Component {
    state = {
        data: [],
        editId: null,
        initNickName: "",
        initPassword: ""
    }

    async getAdminList() {
        let res = await httpRequest("/admin/getList", "post")
        if (res.data.code) {
            this.setState({
                data: res.data.list
            })
        } else {
            message.error(res.data.msg)
        }
    }
    editCell(editData) {
        this.setState({
            editId: editData.id,
            initNickName: editData.nick_name,
            initPassword: editData.password
        })
    }
    async deleteData(id) {
        let res = await httpRequest("/admin/deleteOne", "post",
            { id })
        if (res.data.code) {
            this.getAdminList()
        } else {
            message.error(res.data.msg)
        }
    }
    async editData(id) {
        this.setState({ editId: null })
        let res = await httpRequest("/admin/edit", "post",
            {
                id,
                nick_name: this.state.initNickName,
                password: this.state.initPassword
            })
        if (res.data.code) {
            this.getAdminList()
        } else {
            message.error(res.data.msg)
        }
    }
    nick_name_change(newValue) {
        this.setState({
            initNickName: newValue
        })
    }
    passwordChange(newValue) {
        this.setState({
            initPassword: newValue
        })
    }
    componentDidMount() {
        this.getAdminList()
    }
    render() {
        const columns = [{
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            align: "center",
        }, {
            title: '昵称',
            dataIndex: 'nick_name',
            key: 'nick_name',
            align: "center",
            render: (text, record) => (
                <div>
                    {
                        record.id === this.state.editId
                            ? <span><Input value={this.state.initNickName} placeholder="请输入昵称" onChange={(e) => { this.nick_name_change(e.target.value) }} /></span>
                            : <span>{text == null ? "未设置" : text}</span>}
                </div>
            )
        }, {
            title: '创建时间',
            dataIndex: 'createAt',
            key: 'createAt',
            align: "center",
        }, {
            title: '密码',
            dataIndex: 'password',
            key: 'password',
            align: "center",
            render: (text, record) => (
                <div>
                    {
                        record.id === this.state.editId
                            ? <span><Input value={this.state.initPassword} placeholder="请输入密码" onChange={(e) => { this.passwordChange(e.target.value) }} /></span>
                            : <span>{text}</span>}
                </div>
            )
        }, {
            title: '操作',
            key: 'action',
            align: "center",
            render: (text, record) => (
                <span>
                    {record.id === this.state.editId
                        ? <Button onClick={() => { this.setState({ editId: null }) }}>取消</Button>
                        : <Button onClick={() => { this.editCell(text) }} type="primary">编辑</Button>}
                    <Divider type="vertical" />
                    {record.id === this.state.editId
                        ?
                        <Popconfirm
                            title="确认修改？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => { this.editData(record.id) }}
                        >
                            <Button type="primary">确认</Button>
                        </Popconfirm>
                        : <Popconfirm
                            title="确认删除？"
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => { this.deleteData(record.id) }}
                        >
                            <Button type="danger">删除</Button>
                        </Popconfirm>}

                </span>
            ),
        }];
        return (
            <div>
                <Button style={{ marginBottom: 10 }} type="primary" onClick={() => { this.getAdminList() }}>刷新</Button>
                <Table rowKey="id" bordered columns={columns} dataSource={this.state.data} />
            </div>
        )
    }
}

export default User