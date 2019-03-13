import React, { Component } from 'react'

import { Button, Form, Table, Input, message, Divider, Popconfirm } from 'antd'

import { httpRequest } from '../../utils/httpRequest'

class ClassifyForm extends Component {
    state = {
        data: [],
        editId: null,
        editTitle: ""
    }
    async getDataList() {
        let res = await httpRequest("/classify/getList", "post")
        if (res.data.code) {
            this.setState({
                data: res.data.list
            })
        }else{
            message.error(res.data.msg)
        }
    }
    componentDidMount() {
        this.getDataList()
    }
    addClassify(e) {
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let res = await httpRequest("/classify/add", "post", values)
                if (res.data.code) {
                    message.success(res.data.msg)
                    this.props.form.resetFields()
                } else {
                    message.error(res.data.msg)
                }
            }
        });
    }
    async deleteOne(id) {
        let res = await httpRequest("/classify/deleteOne", "post", { id })
        if (res.data.code) {
            message.success(res.data.msg)
            this.getDataList()
        } else {
            message.error(res.data.msg)
        }
    }
    async editCell(data) {
        this.setState({
            editId: data.id,
            editTitle: data.title
        })
    }
    async editOne() {
        let res = await httpRequest("/classify/edit", "post", {
            id: this.state.editId,
            title: this.state.editTitle
        })
        if (res.data.code) {
            message.success(res.data.msg)
            this.setState({ editId: null })
            this.getDataList()
        } else {
            message.error(res.data.msg)
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const columns = [
            {
                title: 'id',
                dataIndex: 'id',
                key: 'id',
                align: "center",
            }, {
                title: '分类标题',
                dataIndex: 'title',
                key: 'title',
                align: "center",
                render: (text, record) => (
                    <div>
                        {record.id === this.state.editId
                            ? <span><Input value={this.state.editTitle} onChange={(e) => { this.setState({ editTitle: e.target.value }) }} /></span>
                            : <span>{text}</span>}
                    </div>
                )
            }, {
                title: "操作",
                key: "action",
                align: "center",
                render: (text, record) => (
                    <span>
                        {record.id === this.state.editId
                            ? <Button onClick={() => { this.setState({ editId: null }) }}>取消</Button>
                            : <Button type="primary" onClick={() => { this.editCell(record) }}>编辑</Button>}
                        <Divider type="vertical" />
                        {record.id === this.state.editId
                            ?
                            <Popconfirm
                                title="确认修改？"
                                okText="确认"
                                cancelText="取消"
                                onConfirm={() => { this.editOne() }}
                            >
                                <Button type="primary">确认</Button>
                            </Popconfirm>
                            : <Popconfirm
                                title="确认删除？"
                                okText="确认"
                                cancelText="取消"
                                onConfirm={() => { this.deleteOne(record.id) }}
                            >
                                <Button type="danger">删除</Button>
                            </Popconfirm>}
                    </span>
                )
            }
        ]
        return (
            <div>
                <Form
                    layout="inline"
                    onClick={(e) => { this.addClassify(e) }}
                >
                    <Form.Item>
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入分类标题!' }],
                        })(
                            <Input placeholder="请输入分类标题" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">添加分类</Button>
                    </Form.Item>
                </Form>
                <Button style={{ marginBottom: 10 }} type="primary" onClick={() => { this.getDataList() }}>刷新</Button>
                <Table rowKey="id" bordered columns={columns} dataSource={this.state.data} />
            </div>
        )
    }
}

const Classify = Form.create({ name: 'classifyForm' })(ClassifyForm)
export default Classify