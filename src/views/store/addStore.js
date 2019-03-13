import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { httpRequest } from '../../utils/httpRequest'


import { Form, Input, Icon, Upload, Modal, Button, message } from "antd"
const { TextArea } = Input

class AddStoreForm extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        logoFileList: [],
        bannerFileList: [],
        logoImgId: Number,
        bannerImgId: []
    }
    handleCancel = () => this.setState({ previewVisible: false })

    logoImgPreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    logoImgChange = ({ file, fileList }) => {
        if (file.response) {
            this.setState({
                logoImgId: file.response.id
            })
        }
        this.setState({
            logoFileList: fileList
        })
    }
    bannerImgPreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    bannerImgChange = ({ file, fileList }) => {
        if (file.response) {
            this.state.bannerImgId.push(file.response.id)
        }
        this.setState({
            bannerFileList: fileList,
        })
    }
    submit = (e) => {
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let t = {};
                const adminId = JSON.parse(localStorage.getItem("adminId"))
                t = Object.assign(values, { logoImg: this.state.logoImgId, bannerImgs: this.state.bannerImgId, adminId })
                let res = await httpRequest("/store/addStore", "post", t)
                if (res.data.code) {
                    this.props.form.resetFields()
                    this.setState({
                        previewImage: '',
                        logoFileList: [],
                        bannerFileList: [],
                        logoImgId: Number,
                        bannerImgId: []
                    })
                    message.success(res.data.msg)
                } else {
                    message.error(res.data.msg)
                }
            }
        });
    }
    render() {
        const formLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const formItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 2,
                },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, logoFileList, bannerFileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const token = localStorage.getItem("token")
        return (
            <Form {...formLayout} onSubmit={this.submit}>
                <Form.Item
                    label="店铺名称"
                >
                    {getFieldDecorator('storeName', {
                        rules: [{
                            required: true, message: '请输入店铺名称!',
                        }],
                    })(
                        <Input placeholder="请输入店铺名称" />
                    )}
                </Form.Item>
                <Form.Item
                    label="店铺简介">
                    {getFieldDecorator('description', {
                        rules: [{
                            required: true, message: '请输入店铺简介!',
                        }],
                    })(
                        <TextArea placeholder="请输入店铺简介" autosize />
                    )}
                </Form.Item>
                <Form.Item
                    label="店铺logo">
                    <Upload
                        action="http://localhost:3001/singleUpLoad"
                        listType="picture-card"
                        headers={{ "Authorization": "Bearer " + token }}
                        fileList={logoFileList}
                        onPreview={this.logoImgPreview}
                        onChange={this.logoImgChange}
                    >
                        {logoFileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="店铺logo" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Form.Item>
                <Form.Item
                    label="店铺背景图">
                    <Upload
                        action="http://localhost:3001/singleUpLoad"
                        listType="picture-card"
                        headers={{ "Authorization": "Bearer " + token }}
                        fileList={bannerFileList}
                        onPreview={this.bannerImgPreview}
                        onChange={this.bannerImgChange}
                    >
                        {bannerFileList.length >= 3 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="店铺背景图" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Form.Item>
                <Form.Item {...formItemLayout}>
                    <Button type="primary" htmlType="submit">添加</Button>
                </Form.Item>
            </Form>
        )
    }
}

const AddStore = Form.create({ name: "addStoreForm" })(AddStoreForm)

export default AddStore