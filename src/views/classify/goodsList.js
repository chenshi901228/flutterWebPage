import React, { Component } from 'react'

import { Table } from 'antd'

import { httpRequest } from '../../utils/httpRequest'

class GoodsList extends Component {
    state = {
        data: []
    }

    async getGoodsList() {
        const adminId = localStorage.getItem("adminId")
        let res = await httpRequest("/goods/goodsList", "post", { adminId })
            .then(res => res)
            .catch(err => err)
        if (res.data.code) {
            this.setState({
                data: res.data.list
            })
        }
    }

    componentDidMount() {
        this.getGoodsList()
    }
    render() {
        const columns = [{
            title: "商品名称",
            dataIndex: "goodsName",
            key: "goodsName",
            align: "center"
        }, {
            title: "商品描述",
            dataIndex: "description",
            key: "description",
            align: "center"
        }, {
            title: "所属店铺",
            dataIndex: "store",
            key: "store",
            align: "center"
        }, {
            title: "商品分类",
            dataIndex: "classify",
            key: "classify",
            align: "center"
        }, {
            title: "商品图片",
            dataIndex: "goodsImgs",
            key: "goodsImgs",
            align: "center",
            render: (text) => (
                <span>
                    {
                        text.map(item => {
                            return <img style={{ width: "40px", height: "40px" }} key={item.id} alt="banner" src={item.url} />
                        })
                    }
                </span>
            )
        }]


        return (
            <Table rowKey="id" bordered columns={columns} dataSource={this.state.data} />
        )
    }
}

export default GoodsList