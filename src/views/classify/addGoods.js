import React, { Component } from 'react'
import { httpRequest } from '../../utils/httpRequest'

import { Form, Input, Icon, Upload, Modal, Button, Select, message } from "antd"
const { TextArea } = Input
const { Option } = Select
const InputGroup = Input.Group


class AddGoodsForm extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        imgsListId: [],
        classifyList: [],
        storeList: [],
        priceAndSize: [],
        priceAndSizeNumber: 0
    }
    async initData() {
        const adminId = localStorage.getItem("adminId")
        let res = await httpRequest("/goods/initAddGoods", "post", { adminId })
        if (res.data.code) {
            this.setState({
                classifyList: res.data.classifyList,
                storeList: res.data.storeList
            })
        } else {
            message.error(res.data.msg)
        }
    }
    componentDidMount() {
        this.initData()
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ file, fileList }) => {
        if (file.response) {
            this.state.imgsListId.push(file.response.id)
        }
        this.setState({
            fileList,
        })
    }
    priceAndSizeChange = (e) => {
        const i = e.target.dataset.index
        const value = e.target.value
        const className = e.target.getAttribute("class")
        if (!this.state.priceAndSize[i]) {
            this.state.priceAndSize[i] = {}
        }
        if (className.match("price")) {
            this.state.priceAndSize[i].p = value
        } else {
            this.state.priceAndSize[i].s = value
        }
    }
    priceAndSizeItem() {
        const children = []
        for (let i = 0; i < this.state.priceAndSizeNumber; i++) {
            children.push(
                <Form.Item
                    key={i}
                    label={"价格" + (i + 1)}
                >
                    <InputGroup compact onBlur={this.priceAndSizeChange}>
                        <Input data-index={i} className="price" style={{ width: 150, textAlign: 'center' }} placeholder="请输入商品价格" />
                        <Input
                            style={{
                                width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff',
                            }}
                            placeholder="/"
                            disabled
                        />
                        <Input data-index={i} className="size" style={{ width: 150, textAlign: 'center', borderLeft: 0 }} placeholder="请输入商品规格" />
                    </InputGroup>
                </Form.Item>
            )
        }
        return children;
    }
    submit = (e) => {
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let t = {}
                t = Object.assign(values, { priceAndSize: this.state.priceAndSize, imgsListId: this.state.imgsListId })
                let res = await httpRequest("/goods/addGoods", "post", t)
                    .then(res => { return res })
                    .catch(error => { return error })
                if (res.data.code) {
                    message.success(res.data.msg)
                    this.props.form.resetFields()
                    this.setState({
                        priceAndSizeNumber:0,
                        previewImage: '',
                        fileList: [],
                        imgsListId: [],
                        priceAndSize: [],
                    })
                } else {
                    message.error(res.data.msg)
                }
            }
        })
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
            labelCol: {
                xs: { span: 24 },
                sm: { span: 0 },
            },
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
        const { previewVisible, previewImage, fileList } = this.state;
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
                    label="店铺选择"
                >
                    {getFieldDecorator('store', {
                        rules: [{
                            required: true, message: '请选择店铺!',
                        }],
                    })(
                        <Select placeholder="请选择店铺">
                            {
                                this.state.storeList.map(item => {
                                    return <Option key={item.id} value={item.storeName}>{item.storeName}</Option>
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    label="商品分类"
                >
                    {getFieldDecorator('classify', {
                        rules: [{
                            required: true, message: '请选择商品分类!',
                        }],
                    })(
                        <Select placeholder="请选择商品分类">
                            {
                                this.state.classifyList.map(item => {
                                    return <Option key={item.id} value={item.title}>{item.title}</Option>
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
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
                {this.priceAndSizeItem()}
                <Form.Item {...formItemLayout}>
                    <Button type="dashed" onClick={
                        () => {
                            this.setState({
                                priceAndSizeNumber: this.state.priceAndSizeNumber + 1
                            })
                        }
                    } style={{ width: '30%' }}>
                        <Icon type="plus" />添加规格</Button>
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
                <Form.Item {...formItemLayout}>
                    <Button htmlType="submit">click</Button>
                </Form.Item>
            </Form>
        )
    }
}

const AddGoods = Form.create({ name: "addGoodsForm" })(AddGoodsForm)

export default AddGoods