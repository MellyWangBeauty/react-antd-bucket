import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Descriptions, Dropdown, Space, Menu, Icon } from "antd";
import { Redirect, Link } from "react-router-dom";
import { getUsers, deleteUser, editUser, addUser } from "@/api/user";
// import TypingCard from '@/components/TypingCard'
// import EditUserForm from "../../forms/edit-user-form"
// import UploadFile from "./forms/upload-file"
const { Column } = Table;
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
    const t2 = (
      <span>
        <Button type='primary' onClick={this.uploadFile.bind(null)}>上传文件</Button>
        <Button style={{ marginRight: 20 + 'px', marginLeft: 20 + 'px' }} type='primary' onClick={this.createCatogery.bind(null, 2)}>创建目录</Button>
        <Button type='primary' onClick={this.createCatogery.bind(null, 2)}>批量操作</Button>
        <Button style={{ marginRight: 20 + 'px', marginLeft: 20 + 'px' }} type='primary'>刷新</Button>
      </span>
    )
    const rowSelection = {
      onChange: (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      }
    };
    return (
      <div className="app-container">
        {/* <TypingCard title='用户管理' source={cardContent} /> */}
        <br />

        <Card title={title}>
          <div>
            <Descriptions column={4}>
              <Descriptions.Item label="存储量">11.86KB </Descriptions.Item>
              <Descriptions.Item label="对象数">1810000000</Descriptions.Item>
              <Descriptions.Item label="访问控制">私有 </Descriptions.Item>
              <Descriptions.Item label="空间类型">自由空间</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions>
              <Descriptions.Item label="今日存储量">11.86KB </Descriptions.Item>
              <Descriptions.Item label="今日文件数">1810000000</Descriptions.Item>
              <Descriptions.Item label="本月API请求次数(GET/PUT)">0/1 </Descriptions.Item>
              <Descriptions.Item label="昨日存储量">11.86KB </Descriptions.Item>
              <Descriptions.Item label="昨日文件数">1810000000</Descriptions.Item>
              <Descriptions.Item label="上月API请求次数(GET/PUT)">0/1 </Descriptions.Item>
            </Descriptions>
          </div>
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
