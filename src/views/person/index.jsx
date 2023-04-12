import React, { Component } from "react";
import { Card, Button, Table, message, Form, Input, Modal } from "antd";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import {
  reqUserInfo,
  deleteUser,
  editUser,
  addUser,
  applyKey,
  getMyGd,
  checkPassword,
} from "@/api/user";
import { workOrderAdd } from "@/api/workOrder";
import "./index.less";
import { reqLogout } from "@/api/login";
// import TypingCard from '@/components/TypingCard'
// import EditUserForm from "../../forms/edit-user-form"
import CheckPassForm from "./forms/check-pass-form";
import ChangeEmailForm from "./forms/change-email-form";
import ChangePassForm from "./forms/change-pass-form";
import CreateGdForm from "./forms/create-gd-form";
import MyGd from "./forms/my-gd";
import { logout, getUserInfo } from "@/store/actions";
import store from "@/store";
import user from "../../store/reducers/user";

const { Column } = Table;
const { TextArea } = Input;

// const history = useHistory()
class User extends Component {
  state = {
    users: {},
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    uploadFile: false,
    addUserModalLoading: false,
    changeEmailModalVisible: false,
    changePassModalVisible: false,
    checkPassModalVisible: false,
    myGdModalVisible: false,
    createGdModalVisible: false,
    tabValue: 1,
    selectedRowKeys: [],
    gds: [],
  };

  reqUserInfo = async () => {
    const result = await reqUserInfo();
    if (result.code === 0) {
      this.setState({
        users: result.data,
      });
    }
  };
  handleEditUser = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editUserModalVisible: true,
    });
  };

  handleDeleteUser = (row) => {
    const { id } = row;
    if (id === "admin") {
      message.error("不能删除管理员用户！");
      return;
    }
    deleteUser({ id }).then((res) => {
      message.success("删除成功");
      this.reqUserInfo();
    });
  };

  handleChangeEmailOk = (_) => {
    const { form } = this.changeChangeEmailRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let { users } = this.state;
      users.email = values.email;
      this.setState({ changeEmailModalVisible: false, users: users });
      let _user = {
        id: users.id,
        userName: users.userName,
        userPassword: values.newPassword,
        userRole: users.userRole,
        email: values.email,
      };
      editUser(_user)
        .then((response) => {
          form.resetFields();
          this.setState({
            editUserModalVisible: false,
            editUserModalLoading: false,
          });
          message.success("编辑成功!");
          this.reqUserInfo();
        })
        .catch((e) => {
          message.success("编辑失败,请重试!");
        });
    });
  };

  handleCheckPassOk = (name) => {
    const { form } = this.changeCheckPassRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log("values", values);
      checkPassword(values).then((res) => {
        console.log("res", res);
      });
      this.setState({ checkPassModalVisible: false });
      if (this.state.name == "email") {
        //弹出更换邮箱
        this.setState({ changeEmailModalVisible: true });
      } else {
        //弹出修改密码
        this.setState({ changePassModalVisible: true });
      }
    });
  };

  handleChangePassOk = (_) => {
    const { form } = this.changePassRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log("修改密码的值", values);
      this.setState({ changePassModalVisible: false });
      // this.setState({ editModalLoading: true, });
      const { users } = this.state;
      let _user = {
        id: users.id,
        userName: users.userName,
        userPassword: values.newPassword,
        userRole: users.userRole,
      };
      editUser(_user)
        .then((response) => {
          form.resetFields();
          this.setState({
            editUserModalVisible: false,
            editUserModalLoading: false,
          });
          message.success("编辑成功!");
          this.reqUserInfo();
        })
        .catch((e) => {
          message.success("编辑失败,请重试!");
        });
    });
  };
  handleCreateGdOk = (_) => {
    const { form } = this.createGdRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log("创建工单", values);
      this.setState({ createGdModalVisible: false });
      // this.setState({ editModalLoading: true, });
      workOrderAdd(values).then((response) => {
        form.resetFields();
        this.setState({
          editUserModalVisible: false,
          editUserModalLoading: false,
        });
        message.success("添加成功!");
        // this.reqUserInfo()
      });
    });
  };

  handleCancel = (_) => {
    this.setState({
      changeEmailModalVisible: false,
      myGdModalVisible: false,
      createGdModalVisible: false,
      checkPassModalVisible: false,
      changePassModalVisible: false,
    });
  };

  uploadFile = (row) => {
    this.setState({
      uploadFile: true,
    });
  };

  changeTab = (v) => {
    console.log("v", v);
    switch (v) {
      case 1:
        break;

      default:
        break;
    }
  };

  handleAddUserOk = (_) => {
    const { form } = this.uploadFileRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addUserModalLoading: true });
      addUser(values)
        .then((response) => {
          form.resetFields();
          this.setState({ uploadFile: false, addUserModalLoading: false });
          message.success("添加成功!");
          this.reqUserInfo();
        })
        .catch((e) => {
          message.success("添加失败,请重试!");
        });
    });
  };
  handleChangeEmail = (name) => {
    this.setState({
      changeEmailModalVisible: true,
      name: name,
    });
  };
  handlePassEmail = (name) => {
    this.setState({
      checkPassModalVisible: true,
      name: name,
    });
  };
  handleMyGd = async () => {
    const { id } = this.state.users;
    const result = await getMyGd({
      currentPage: 0,
      pageSize: 100,
      userId: id,
    });
    const { data, code } = result;
    const { records } = data;
    if (code === 0) {
      this.setState({
        gds: records,
      });
    }
    this.setState({
      myGdModalVisible: true,
    });
  };
  handleCreateGd = () => {
    this.setState({
      createGdModalVisible: true,
    });
  };
  handleCreateAccessKey = () => {
    applyKey({}).then((response) => {
      console.log(response);
      message.success("申请成功!");
      // this.reqUserInfo()
    });
  };
  handleLogout = () => {
    Modal.confirm({
      title: "注销",
      content: "确定要退出系统吗?",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        this.props.logout();
      },
    });
    // reqLogout().then(res => {
    //   message.success("登出成功")
    //   debugger
    //   store.dispatch(logout());
    // })
  };

  componentDidMount() {
    this.reqUserInfo();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { users, selectedRowKeys, gds } = this.state;
    const title1 = <span>个人中心</span>;
    const title2 = <span>问题反馈</span>;
    const title3 = <span>账号管理</span>;
    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 14 },
      },
    };
    return (
      <div className="app-container">
        {/* <TypingCard title='用户管理' source={cardContent} /> */}
        <br />

        <Card title={title1} className="person">
          <Form {...formItemLayout} name="form">
            <Form.Item label="用户名">
              {getFieldDecorator("userName", { initialValue: users.userName })(
                <Input placeholder="用户名" disabled />
              )}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator("email", { initialValue: users.email })(
                <Input placeholder="邮箱" disabled />
              )}
            </Form.Item>
            <Form.Item label="密码" name="password">
              <Input type="password" placeholder="******" disabled />
              <Button
                type="primary"
                style={{ marginLeft: 10 + "px" }}
                onClick={this.handlePassEmail.bind(null, "pass")}
              >
                更改
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card
          style={{ marginTop: 10 + "px" }}
          title={title2}
          className="person"
        >
          <Form {...formItemLayout}>
            <Form.Item>
              <Button
                type="primary"
                style={{ marginLeft: 10 + "px" }}
                onClick={this.handleMyGd.bind(null)}
              >
                我的工单
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: 10 + "px" }}
                onClick={this.handleCreateGd.bind(null)}
              >
                创建工单
              </Button>

              {/*<Button*/}
              {/*    type="primary"*/}
              {/*    style={{marginLeft: 10 + 'px'}}*/}
              {/*    onClick={this.handleCreateAccessKey.bind(null)}*/}
              {/*>*/}
              {/*    申请accessKey和secretKey*/}

              {/*</Button>*/}
            </Form.Item>
          </Form>
        </Card>
        <Card
          style={{ marginTop: 10 + "px" }}
          title={title3}
          className="person"
        >
          <Form {...formItemLayout}>
            <Form.Item>
              <Button
                type="primary"
                style={{ marginLeft: 10 + "px" }}
                onClick={this.handleLogout.bind(null)}
              >
                退出登录
              </Button>
              {/* <Button type="primary" style={{ marginLeft: 10 + "px" }}>
                切换账号
              </Button> */}
            </Form.Item>
          </Form>
        </Card>
        <CheckPassForm
          wrappedComponentRef={(formRef) => (this.changeCheckPassRef = formRef)}
          visible={this.state.checkPassModalVisible}
          name={this.state.name}
          onCancel={this.handleCancel}
          onOk={this.handleCheckPassOk}
        />
        <ChangeEmailForm
          wrappedComponentRef={(formRef) =>
            (this.changeChangeEmailRef = formRef)
          }
          visible={this.state.changeEmailModalVisible}
          onCancel={this.handleCancel}
          onOk={this.handleChangeEmailOk}
        />
        <ChangePassForm
          wrappedComponentRef={(formRef) => (this.changePassRef = formRef)}
          visible={this.state.changePassModalVisible}
          onCancel={this.handleCancel}
          onOk={this.handleChangePassOk}
        />
        <CreateGdForm
          wrappedComponentRef={(formRef) => (this.createGdRef = formRef)}
          visible={this.state.createGdModalVisible}
          onCancel={this.handleCancel}
          onOk={this.handleCreateGdOk}
        />
        <MyGd
          wrappedComponentRef={(formRef) => (this.myGdRef = formRef)}
          visible={this.state.myGdModalVisible}
          // confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleCancel}
          gds={gds}
        />
        {/*
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

const mapStateToProps = (state) => {
  return {
    ...state.app,
    ...state.user,
    ...state.settings,
  };
};
// export default User;
export default connect(mapStateToProps, { logout, getUserInfo })(
  Form.create({ name: "User" })(User)
);
