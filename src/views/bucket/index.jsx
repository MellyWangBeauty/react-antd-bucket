import React, { Component } from "react";
import {
  Card,
  Button,
  Table,
  message,
  Divider,
  Modal,
  Select,
  Collapse,
  Form,
  Input,
} from "antd";
import { Redirect, Link } from "react-router-dom";
import { getUsers, deleteUser, editUser, addUser } from "@/api/user";
import { bucketAdd, bucketQuery, checkExits, deleteBucket } from "@/api/bucket";
import TypingCard from "@/components/TypingCard";
import EditUserForm from "./forms/edit-user-form";
import AddUserForm from "./forms/add-user-form";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;
const { Column } = Table;
const { Panel } = Collapse;
class User extends Component {
  state = {
    bucket: [],
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    addUserModalVisible: false,
    addUserModalLoading: false,
    listQuery: {
      bucketName: "",
      type: "",
      authority: "",
    },
  };
  bucketQuery = async () => {
    let typeName, authorityName;
    const result = await bucketQuery();
    const bucket = result.data;
    bucket.map((buc, id) => {
      const { type, authority } = buc;
      switch (type) {
        case 0:
          typeName = "自有空间";
          break;
        case 1:
          typeName = "授权只读";
          break;
        case 2:
          typeName = "授权读写";
          break;
      }
      switch (authority) {
        case 0:
          authorityName = "公开";
          break;
        case 1:
          authorityName = "私有";
          break;
      }
      bucket[id] = { ...buc, type: typeName, authority: authorityName };
    });
    this.setState({
      bucket,
    });
  };
  handleEditUser = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editUserModalVisible: true,
    });
  };

  handleDeleteUser = (row) => {
    const { id } = row;
    let that = this;
    confirm({
      title: "确认删除吗?",
      icon: <ExclamationCircleFilled />,
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteBucket(id).then((res) => {
          message.success("删除成功");
          that.bucketQuery();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  handleEditUserOk = (_) => {
    const { form } = this.editUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editUser(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            editUserModalVisible: false,
            editUserModalLoading: false,
          });
          message.success("编辑成功!");
          this.bucketQuery();
        })
        .catch((e) => {
          message.success("编辑失败,请重试!");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editUserModalVisible: false,
      addUserModalVisible: false,
    });
  };

  handleAddUser = (row) => {
    this.setState({
      addUserModalVisible: true,
    });
  };

  handleAddUserOk = (_) => {
    const { form } = this.addUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addUserModalLoading: true });
      checkExits(values.bucketName).then((res) => {
        console.log("res", res);
        if (res.data != true) {
          bucketAdd(values).then((response) => {
            form.resetFields();
            message.success("添加成功!");
            this.bucketQuery();
            this.setState({
              addUserModalVisible: false,
              addUserModalLoading: false,
            });
          });
        } else {
          message.error("bucket名字重复");
        }
        this.setState({ addUserModalLoading: false });
      });
      // bucketAdd(values).then((response) => {
      //   form.resetFields();
      //   message.success("添加成功!")
      //   this.bucketQuery()
      //   this.setState({ addUserModalVisible: false, addUserModalLoading: false });
      // })
    });
  };
  componentDidMount() {
    this.bucketQuery();
  }
  filterBucketNameChange = (e) => {
    let value = e.target.value;
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        bucketName: value,
      },
    }));
  };
  filterTypeChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        type: value,
      },
    }));
  };
  filterAuthorityChange = (value) => {
    this.setState((state) => ({
      listQuery: {
        ...state.listQuery,
        authority: value,
      },
    }));
  };

  render() {
    const { bucket } = this.state;

    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddUser}>
          新建空间
        </Button>
        <Button
          style={{ marginLeft: 20 + "px" }}
          type="primary"
          onClick={this.bucketQuery}
        >
          刷新列表
        </Button>
      </span>
    );
    const cardContent = `在这里，你可以对系统中的用户进行管理，例如添加一个新用户，或者修改系统中已经存在的用户。`;
    return (
      <div className="app-container">
        {/* <TypingCard title='用户管理' source={cardContent} /> */}
        <br />
        <Card title={title}>
          <Collapse defaultActiveKey={["1"]}>
            <Panel header="筛选" key="1">
              <Form layout="inline">
                <Form.Item label="空间名称:">
                  <Input onChange={this.filterBucketNameChange} />
                </Form.Item>
                <Form.Item label="空间类型:">
                  <Select
                    style={{ width: 120 }}
                    onChange={this.filterTypeChange}
                  >
                    <Select.Option value={0}>自有空间</Select.Option>
                    <Select.Option value={1}>授权只读</Select.Option>
                    <Select.Option value={2}>授权读写</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="访问控制:">
                  <Select
                    style={{ width: 120 }}
                    onChange={this.filterAuthorityChange}
                  >
                    <Select.Option value={0}>公开</Select.Option>
                    <Select.Option value={1}>私有</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    icon="search"
                    onClick={this.bucketQuery}
                  >
                    搜索
                  </Button>
                </Form.Item>
              </Form>
            </Panel>
          </Collapse>
          <br />
          <Table bordered rowKey="id" dataSource={bucket} pagination={false}>
            <Column
              title="空间名称"
              dataIndex="bucketName"
              key="bucketName"
              align="center"
            />
            <Column
              title="空间类型"
              dataIndex="type"
              key="type"
              align="center"
            />
            <Column
              title="访问控制"
              dataIndex="authority"
              key="authority"
              align="center"
            />
            <Column
              title="创建时间"
              dataIndex="createTime"
              key="createTime"
              align="center"
            />
            <Column
              title="操作"
              key="action"
              width={350}
              align="center"
              render={(text, row) => (
                <span>
                  <Button type="primary">
                    <Link to="/spaceOverflow">概览</Link>
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    onClick={this.handleEditUser.bind(null, row)}
                  >
                    文件
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    onClick={this.handleDeleteUser.bind(null, row)}
                  >
                    删除
                  </Button>
                  {/* <Button type="primary" onClick={this.handleDeleteUser.bind(null,row)}>删除</Button> */}
                </span>
              )}
            />
          </Table>
        </Card>
        <EditUserForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.editUserFormRef = formRef)}
          visible={this.state.editUserModalVisible}
          confirmLoading={this.state.editUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
        />
        <AddUserForm
          wrappedComponentRef={(formRef) => (this.addUserFormRef = formRef)}
          visible={this.state.addUserModalVisible}
          confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddUserOk}
        />
      </div>
    );
  }
}

export default User;
