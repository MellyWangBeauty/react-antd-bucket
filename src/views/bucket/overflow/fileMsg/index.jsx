import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Descriptions, Dropdown, Space, Menu, Icon } from "antd";
import { Redirect, Link } from "react-router-dom";
import { getUsers, deleteUser, editUser, addUser } from "@/api/user";
import TypingCard from '@/components/TypingCard'
import UploadFile from "./forms/upload-file"
import AddCatogery from "./forms/add-catogery"
const { Column } = Table;
class User extends Component {
  state = {
    users: [],
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    uploadFile: false,
    addCatogery: false,
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
      uploadFile: false,
      addCatogery: false,
    });
  };

  uploadFile = (row) => {
    this.setState({
      uploadFile: true,
    });
  };

  changeTab = (v) => {
    console.log('v', v);
    this.setState({
      tabValue: v
    })
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
    this.setState({
      addCatogery:true
    })
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
              <Descriptions.Item label="标准存储">共1个文件 共11.86KB存储量</Descriptions.Item>
            </Descriptions>

            <Card title={t2}>
              <Table bordered rowKey="id" dataSource={users} pagination={false} rowSelection={rowSelection}>
                <Column title="空间名称" dataIndex="id" key="id" align="center" />
                <Column title="文件名" dataIndex="name" key="name" align="center" />
                <Column title="文件大小" dataIndex="role" key="role" align="center" />
                <Column title="文件类型" dataIndex="description" key="description" align="center" />
                <Column title="存储类型" dataIndex="description" key="description1" align="center" />
                <Column title="最近更新" dataIndex="description" key="description2" align="center" />
                <Column title="操作" key="action" width={150} align="center" render={(text, row) => (
                  <span>
                    <Link to="/spaceOverflow" style={{ marginRight: 10 + 'px' }}>详情</Link>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item onClick={eve => { eve.domEvent.stopPropagation() }} >
                            下载
                          </Menu.Item>
                          <Menu.Item onClick={eve => { eve.domEvent.stopPropagation() }} >
                            禁用
                          </Menu.Item>
                          <Menu.Item onClick={eve => { eve.domEvent.stopPropagation() }} >
                            删除
                          </Menu.Item>
                        </Menu>
                      }
                    >
                      <a onClick={event => event.stopPropagation()}>
                        更多<Icon type="down" />
                      </a>
                    </Dropdown>
                  </span>
                )} />
              </Table>
            </Card>
          </div>

        </Card>
        {/* <EditUserForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editUserFormRef = formRef}
          visible={this.state.editUserModalVisible}
          confirmLoading={this.state.editUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
        /> */}
        <UploadFile
          wrappedComponentRef={formRef => this.uploadFileRef = formRef}
          visible={this.state.uploadFile}
          // confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
        // onOk={this.handleAddUserOk}
        />
        <AddCatogery
          wrappedComponentRef={formRef => this.addCatogeryRef = formRef}
          visible={this.state.addCatogery}
          // confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
        // onOk={this.handleAddUserOk}
        />
      </div>
    );
  }
}

export default User;
