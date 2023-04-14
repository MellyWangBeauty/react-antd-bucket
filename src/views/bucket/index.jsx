import React, { Component } from "react";
import {
  Card,
  Button,
  Table,
  message,
  Divider,
  Modal,
  Collapse,
  Form,
  Select,
  Input,
} from "antd";
import {
  bucketAdd,
  bucketQuery,
  checkExits,
  bucketUpdate,
  deleteBucket,
  filterBucket,
} from "@/api/bucket";
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
    const result = await bucketQuery();
    const bucket = result.data;
    this.setState({
      bucket,
      listQuery: {
        bucketName: "",
        type: "",
        authority: "",
      },
    });
  };
  filterBucket = async () => {
    const result = await filterBucket(this.state.listQuery);
    const bucket = result.data;
    // console.log(bucket);
    this.setState({
      bucket,
    });
  };
  /**
   * 修改
   * @param row
   */
  handleEditBucket = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editUserModalVisible: true,
    });
  };
  /**
   * 删除
   * @param row
   */
  handleDeleteBucket = (row) => {
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
  /**
   * 打开存储桶详情
   * @param url
   * @param row
   */
  handleGoPage = (url, row) => {
    this.props.history.push(
      url +
        "?bucketId=" +
        row.id +
        "&bucketName=" +
        row.bucketName +
        "&authority=" +
        row.authority
    );
  };
  /**
   * 修改
   * @param _
   */
  handleEditBucketOk = (_) => {
    const { form } = this.editUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      let req = {
        bucketId: values.id,
        authority: values.authority,
        bucketName: values.bucketName,
      };
      bucketUpdate(req)
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
  /**
   * 取消删除
   * @param _
   */
  handleCancel = (_) => {
    this.setState({
      editUserModalVisible: false,
      addUserModalVisible: false,
    });
  };
  /**
   * 显示添加
   * @param row
   */
  handleAddBucket = (row) => {
    this.setState({
      addUserModalVisible: true,
    });
  };
  /**
   * 添加
   * @param _
   */
  handleAddBucketOk = (_) => {
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
    });
  };

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

  /**
   * 加载存储通
   */
  componentDidMount() {
    this.bucketQuery().then((r) => {
      console.log(r);
    });
  }

  render() {
    const { bucket } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={this.handleAddBucket}>
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
                  <Input
                    onChange={this.filterBucketNameChange}
                    value={this.state.listQuery.bucketName}
                  />
                </Form.Item>
                <Form.Item label="空间类型:">
                  <Select
                    style={{ width: 120 }}
                    onChange={this.filterTypeChange}
                    value={this.state.listQuery.type}
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
                    value={this.state.listQuery.authority}
                  >
                    <Select.Option value={0}>公开</Select.Option>
                    <Select.Option value={1}>私有</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    icon="search"
                    // onClick={this.bucketFilter(this.state.listQuery)}
                    onClick={this.filterBucket}
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
              render={(type, record, index) => {
                let _typeMap = ["自由空间", "授权只读", "授权读写"];
                return _typeMap[type];
              }}
            />
            <Column
              title="访问控制"
              dataIndex="authority"
              key="authority"
              align="center"
              render={(authority, record, index) => {
                return authority === 0 ? "公开" : "私有";
              }}
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
                  <Button
                    type="primary"
                    onClick={this.handleGoPage.bind(
                      this,
                      "/spaceOverflow",
                      row
                    )}
                  >
                    {/* <Link to="/spaceOverflow">概览</Link> */}
                    概览
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    onClick={this.handleEditBucket.bind(null, row)}
                  >
                    编辑
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    onClick={this.handleDeleteBucket.bind(null, row)}
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
          onOk={this.handleEditBucketOk}
        />
        <AddUserForm
          wrappedComponentRef={(formRef) => (this.addUserFormRef = formRef)}
          visible={this.state.addUserModalVisible}
          confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddBucketOk}
        />
      </div>
    );
  }
}

export default User;
