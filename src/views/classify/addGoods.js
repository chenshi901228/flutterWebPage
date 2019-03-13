import React, { Component } from 'react'

import { Form, Input, Icon, Upload, Modal } from "antd"
const { TextArea } = Input

class AddGoodsForm extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        listId: []
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
        console.log(this.state.listId.join(","))
    }

    handleChange = ({ file, fileList }) => {
        if (file.response) {
            this.state.listId.push(file.response.id)
        }
        this.setState({
            fileList,
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const token = localStorage.getItem("token")
        return (
            <Form {...formItemLayout}>
                <Form.Item
                    label="商品名称"
                >
                    {getFieldDecorator('goodsName', {
                        rules: [{
                            required: true, message: '请输入商品名称!',
                        }],
                    })(
                        <Input placeholder="请输入商品名称" />
                    )}
                </Form.Item>
                <Form.Item
                    label="价格"
                >
                    <Form.Item style={{ display: "inline-block" }}>
                        {getFieldDecorator('price', {
                            rules: [{
                                required: true, message: '请输入商品价格!',
                            }],
                        })(
                            <Input placeholder="请输入商品价格" />
                        )}
                    </Form.Item>
                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>/</span>
                    <Form.Item style={{ display: "inline-block" }}>
                        {getFieldDecorator('size', {
                            rules: [{
                                required: true, message: '请输入商品规格!',
                            }],
                        })(
                            <Input placeholder="请输入商品规格" />
                        )}
                    </Form.Item>
                </Form.Item>
                <Form.Item
                    label="商品描述">
                    {getFieldDecorator('description', {
                        rules: [{
                            required: true, message: '请输入商品描述!',
                        }],
                    })(
                        <TextArea placeholder="请输入商品描述" autosize />
                    )}
                </Form.Item>
                <Form.Item
                    label="商品图片">
                    <Upload
                        action="http://localhost:3001/singleUpLoad"
                        listType="picture-card"
                        headers={{ "Authorization": "Bearer " + token }}
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                        {fileList.length >= 10 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="商品图" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Form.Item>
            </Form>
        )
    }
}

const AddGoods = Form.create({ name: "addGoodsForm" })(AddGoodsForm)

export default AddGoods