import React, { Component } from 'react'
import { httpRequest } from '../../utils/httpRequest'


import { Upload, Icon, Modal, Button, message } from 'antd';

class Banner extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        imgsId: []
    };
    async initImgsList() {
        let res = await httpRequest("/homeBanner/list", "post")
        let newFileList = res.data.bannerImgs.map(item => {
            let obj = {}
            obj.uid = item.id
            obj.status = "done"
            obj.url = item.url
            return obj
        })
        this.setState({
            fileList: newFileList
        })
    }

    componentDidMount() {
        this.initImgsList()
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = async ({ file, fileList }) => {
        if (file.status === "removed") {
            let res = await httpRequest("/homeBanner/delete", "post", {
                id: file.uid
            })
            res.data.code ? message.success(res.data.msg) : message.error(res.data.msg)
        }
        if (file.response) {
            this.state.imgsId.push(file.response.id)
        }
        this.setState({ fileList })
    }
    save = async () => {
        let res = await httpRequest("/homeBanner/add", "post", {
            imgsId: this.state.imgsId
        })
        if (res.data.code) {
            message.success(res.data.msg)
            this.setState({
                previewImage: '',
                fileList: [],
                imgsId: []
            })
        } else {
            message.error(res.data.msg)
        }
    }

    render() {
        const token = localStorage.getItem("token")
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="http://localhost:3001/singleUpLoad"
                    listType="picture-card"
                    headers={{ "Authorization": "Bearer " + token }}
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 6 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <Button disabled={this.state.imgsId.length > 0 ? false : true} type="primary" onClick={this.save}>保存</Button>
            </div>
        );
    }
}
export default Banner