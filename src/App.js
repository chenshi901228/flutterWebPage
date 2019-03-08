import React, { Component } from 'react'
import { Route, NavLink } from 'react-router-dom'
import {
  Layout, Menu, Icon, Button, Modal, Form, Input, message
} from 'antd';

import User from './views/user/userList'
import { httpRequest } from './utils/httpRequest'

const {
  Header, Content, Sider,
} = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {
  state = {
    loginPage: false,
    admin: ""
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
  componentDidMount() {
    const admin = localStorage.getItem("admin")
    this.setState({ admin: admin })
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
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="sub1" title={<span><Icon type="user" />用户管理</span>}>
              <Menu.Item key="1"><NavLink to="/user/userList">用户列表</NavLink></Menu.Item>
              {/* <Menu.Item key="2"><NavLink to="/user/table">用户列表1</NavLink></Menu.Item> */}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Content style={{ margin: '100px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff' }}>
              <Route path="/user/userList" component={User} />
              {/* <Route path="/user/table" component={Edittable} /> */}
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
          localStorage.setItem("token", res.data.token)
          localStorage.setItem("admin", res.data.phone)
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
