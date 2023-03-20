import React, { Component } from "react";
import { Card, Button, Table, message, Form, Input } from "antd";

import { Redirect, Link } from "react-router-dom";
import { getUsers, deleteUser, editUser, addUser } from "@/api/user";
// import TypingCard from '@/components/TypingCard'
// import EditUserForm from "../../forms/edit-user-form"
// import UploadFile from "./forms/upload-file"
const { Column } = Table;
const { TextArea } = Input;
class User extends Component {
  state = {
    users: [],
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    uploadFile: false,
    addUserModalLoading: false,
    tabValue: 1,
    selectedRowKeys: []
  };
  getUsers = async () => {
    const result = await getUsers()
    const { users, status } = result.data
    if (status === 0) {
      this.setState({
        users
      })
    }
  }
  handleEditUser = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editUserModalVisible: true,
    });
  };

  handleDeleteUser = (row) => {
    const { id } = row
    if (id === "admin") {
      message.error("不能删除管理员用户！")
      return
    }
    deleteUser({ id }).then(res => {
      message.success("删除成功")
      this.getUsers();
    })
  }

  handleEditUserOk = _ => {
    const { form } = this.editUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true, });
      editUser(values).then((response) => {
        form.resetFields();
        this.setState({ editUserModalVisible: false, editUserModalLoading: false });
        message.success("编辑成功!")
        this.getUsers()
      }).catch(e => {
        message.success("编辑失败,请重试!")
      })

    });
  };

  handleCancel = _ => {
    this.setState({
      editUserModalVisible: false,
      uploadFile: false,
    });
  };

  uploadFile = (row) => {
    this.setState({
      uploadFile: true,
    });
  };

  changeTab = (v) => {
    console.log('v', v);
    switch (v) {
      case 1:
        
        break;
    
      default:
        break;
    }
  };

  handleAddUserOk = _ => {
    const { form } = this.uploadFileRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addUserModalLoading: true, });
      addUser(values).then((response) => {
        form.resetFields();
        this.setState({ uploadFile: false, addUserModalLoading: false });
        message.success("添加成功!")
        this.getUsers()
      }).catch(e => {
        message.success("添加失败,请重试!")
      })
    });
  };
  createCatogery = () => {

  };
  componentDidMount() {
    this.getUsers()
  }
  render() {
    const { users, selectedRowKeys } = this.state
    const title = (
      <span>
        <Button type='primary' ><Link to="/spaceOverflow">空间概览</Link></Button>
        <Button style={{ marginRight: 20 + 'px', marginLeft: 20 + 'px' }} type='primary' ><Link to="/fileMsg">文件管理</Link></Button>
        <Button type='primary' ><Link to="/spaceSet">空间设置</Link></Button>
      </span>
    )
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <div className="app-container">
        {/* <TypingCard title='用户管理' source={cardContent} /> */}
        <br />

        <Card title={title}>
          <Form {...formItemLayout}>
            <Form.Item label="访问控制">
              <Button type="primary">修改为公开空间</Button>
            </Form.Item>
          </Form>
          
          <Form {...formItemLayout}>
            <Form.Item label="空间授权">
              <Button type="primary"><Link to="/auth">设置</Link></Button>
            </Form.Item>
          </Form>
          <Form {...formItemLayout}>
            <Form.Item label="标签管理">
              <Button type="primary"><Link to="/tag">设置</Link></Button>
            </Form.Item>
          </Form>
          <Form {...formItemLayout}>
            <Form.Item label="删除空间">
              <Button type="primary">删除空间</Button>
            </Form.Item>
          </Form>
          <Form {...formItemLayout}>
            <Form.Item label="空间备注">
              <TextArea rows={4} placeholder="请输入空间备注" />
            </Form.Item>
            <Form.Item wrapperCol={{offset:4}}>
              <Button type="primary">确定</Button>
            </Form.Item>
          </Form>
        </Card>
        {/* <EditUserForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editUserFormRef = formRef}
          visible={this.state.editUserModalVisible}
          confirmLoading={this.state.editUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
        />
        <UploadFile
          wrappedComponentRef={formRef => this.uploadFileRef = formRef}
          visible={this.state.uploadFile}
          // confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
        // onOk={this.handleAddUserOk}
        /> */}
      </div>
    );
  }
}

export default User;
