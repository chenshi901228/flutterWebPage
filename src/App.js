import React, { Component } from 'react'
import { Route, NavLink } from 'react-router-dom'
import {
  Layout, Menu, Icon, Button, Modal, Form, Input, message
} from 'antd';

import User from './views/user/userList'
import Classify from './views/classify/classify'
import AddGoods from './views/classify/addGoods'
import AddStore from './views/store/addStore'
import StoreList from './views/store/storeList'
import { httpRequest } from './utils/httpRequest'

const {
  Header, Content, Sider,
} = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {
  state = {
    loginPage: false,
    admin: "",
    openKey: [],
    selectedKey: []
  }
  loginBtn() {
    this.setState({
      loginPage: true
    })
  }
  cancel() {
    this.setState({
      loginPage: false
    })
  }
  loginType = (phone) => {
    this.setState({
      admin: phone
    })
  }
  menuClick = (e) => {
    this.setState({
      selectedKey: [e.key]
    })
    sessionStorage.setItem("menuItem", e.key)
  }
  menuOpenChange = (e) => {
    this.setState({
      openKey: e
    })
    sessionStorage.setItem("menuOpen", JSON.stringify(e))
  }
  componentDidMount() {
    const admin = localStorage.getItem("admin")
    const menuItem = sessionStorage.getItem("menuItem") || "1-1"
    const menuOpen = JSON.parse(sessionStorage.getItem("menuOpen")) || ["1"]
    this.setState({
      admin: admin,
      openKey: menuOpen,
      selectedKey: [menuItem]
    })
  }
  render() {
    return (
      <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <h1 style={{ color: "white", textAlign: "right" }}>
            {this.state.admin}
            <Button
              onClick={() => { this.loginBtn() }}
              style={{ marginLeft: 20 }} type="primary">
              登录
          </Button>
          </h1>
          <Modal
            title="登录"
            visible={this.state.loginPage}
            footer={null}
            onCancel={() => { this.cancel() }}
          >
            <LoginComponent handle={() => { this.cancel() }} loginType={this.loginType.bind(this)} />
          </Modal>
        </Header>
        <Sider width={200} style={{ overflow: 'auto', height: '100vh', position: 'fixed', top: 64 }}>
          <Menu
            mode="inline"
            theme="dark"
            onClick={this.menuClick}
            onOpenChange={this.menuOpenChange}
            openKeys={this.state.openKey}
            selectedKeys={this.state.selectedKey}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="1" title={<span><Icon type="user" />用户管理</span>}>
              <Menu.Item key="1-1"><NavLink to="/user/userList">用户列表</NavLink></Menu.Item>
            </SubMenu>
            <SubMenu key="2" title={<span><Icon type="bars" />商品分类</span>}>
              <Menu.Item key="2-1"><NavLink to="/goods/classify">分类</NavLink></Menu.Item>
              <Menu.Item key="2-2"><NavLink to="/goods/addGoods">添加商品</NavLink></Menu.Item>
            </SubMenu>
            <SubMenu key="3" title={<span><Icon type="shop" />店铺管理</span>}>
              <Menu.Item key="3-1"><NavLink to="/store/storeList">店铺列表</NavLink></Menu.Item>
              <Menu.Item key="3-2"><NavLink to="/store/addStore">添加店铺</NavLink></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Content style={{ margin: '100px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff' }}>
              <Route path="/user/userList" component={User} />
              <Route path="/goods/classify" component={Classify} />
              <Route path="/goods/addGoods" component={AddGoods} />
              <Route path="/store/storeList" component={StoreList} />
              <Route path="/store/addStore" component={AddStore} />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}


class LoginForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let params = { phone: parseInt(values.phone), password: values.password }
        let res = await httpRequest("/admin/login", "post", params)
        if (res.data.code) {
          message.success(res.data.msg)
          localStorage.setItem("token", res.data.token)
          localStorage.setItem("admin", res.data.phone)
          localStorage.setItem("adminId", JSON.stringify(res.data.id))
          this.props.handle();
          this.props.loginType(res.data.phone)
          this.props.form.resetFields()
        } else {
          message.error(res.data.msg)
        }
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号！' }],
          })(
            <Input allowClear={true} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入手机号码" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码！' }],
          })(
            <Input allowClear={true} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
          )}
        </Form.Item>
        <Button htmlType="submit" type="primary">登录</Button>
      </Form>
    )
  }
}
const LoginComponent = Form.create({ name: "login_form" })(LoginForm)


export default App;
