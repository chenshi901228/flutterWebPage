import React, { Component } from 'react'
import { Table } from 'antd'

import { httpRequest } from '../../utils/httpRequest'



class StoreList extends Component {
    state = {
        data: []
    }
    async getStoreList() {
        const adminId = localStorage.getItem("adminId")
        let res = await httpRequest("/store/storeList", "post", { adminId })
        this.setState({
            data: res.data.list
        })
    }
    componentDidMount() {
        this.getStoreList()
    }
    render() {
        const columns = [{
            title: "店铺名称",
            dataIndex: "storeName",
            key: "storeName",
            align: "center",
        }, {
            title: "店铺简介",
            dataIndex: "description",
            key: "description",
            align: "center",
        }, {
            title: "店铺logo",
            dataIndex: "storelogoImg",
            key: "storelogoImg",
            align: "center",
            render: (text) => (
                <span>
                    {
                        text.map(item => {
                            return <img style={{width:"40px",height:"40px"}} key={item.id} alt="logo" src={item.url} />
                        })
                    }
                </span>
            )
        }, {
            title: "店铺banner",
            dataIndex: "storeBannerImgs",
            key: "storeBannerImgs",
            align: "center",
            render: (text) => (
                <span>
                    {
                        text.map(item => {
                            return <img style={{width:"40px",height:"40px"}} key={item.id} alt="banner" src={item.url} />
                        })
                    }
                </span>
            )
        }]
        return (
            <Table bordered rowKey="id" columns={columns} dataSource={this.state.data} />
        )
    }
}

export default StoreList