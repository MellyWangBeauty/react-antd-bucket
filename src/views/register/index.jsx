import React, { useState } from "react";
import { Redirect,Link } from "react-router-dom";
import { Form, Icon, Input, Button, message, Spin } from "antd";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";
import "./index.less";
import { login, getUserInfo } from "@/store/actions";
import { register,sendcode } from "@/api/login";
const Login = (props) => {
  const { form, token, login, getUserInfo } = props;
  const { getFieldDecorator } = form;

  const [loading, setLoading] = useState(false);

  const handleLogin = (userName, userPassword, email, checkPassword, verificationCode) => {
    // 登录完成后 发送请求 调用接口获取用户信息
    setLoading(true);
    register({userName, userPassword, email, checkPassword, verificationCode})
      .then((data) => {
        message.success("注册成功");
        // handleUserInfo(data.token);
      })
      .catch((error) => {
        setLoading(false);
        // message.error(error);
      });
  };

  // 获取用户信息
  const handleUserInfo = (token) => {
    getUserInfo(token)
      .then((data) => {})
      .catch((error) => {
        message.error(error);
      });
  };

  const getSendcode=()=>{
    form.validateFields(['email'])
    .then((values) => {
      sendcode({email:values.email})
      .then((data) => {
        console.log(data);
        message.success("发送成功");
      }).catch(err=>{
        console.log(err);
      })
    })
    .catch((errorInfo) => {
      console.log('errorInfo',errorInfo);
    });
    
  }

  const handleSubmit = (event) => {
    // 阻止事件的默认行为
    event.preventDefault();

    // 对所有表单字段进行检验
    form.validateFields((err, values) => {
      // 检验成功
      if (!err) {
        const { userName, userPassword, email ,checkPassword, verificationCode} = values;
        handleLogin(userName, userPassword, email ,checkPassword,  verificationCode);
      } else {
        console.log("检验失败!");
      }
    });
  };

  if (token) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <DocumentTitle title={"注册"}>
      <div className="login-container">
        <Form onSubmit={handleSubmit} className="content">
          <div className="title">
            <h2>注册</h2>
          </div>
          <Spin spinning={loading} tip="注册中...">
            <Form.Item label="用户名">
              {getFieldDecorator("userName", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入用户名",
                  },
                ],
                initialValue: "admin", // 初始值
              })(
                <Input
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator("email", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入邮箱",
                  },
                ],
                initialValue: "1047215763@qq.com", // 初始值
              })(
                <Input
                  placeholder="邮箱"
                />
              )}
            </Form.Item>
            <Form.Item label="验证码">
              {getFieldDecorator("verificationCode", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入验证码",
                  },
                ],
              })(
                <Input
                  placeholder="验证码"
                />
              )}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator("userPassword", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入密码",
                  },
                ],
                initialValue: "12345678", // 初始值
              })(
                <Input
                  type="userPassword"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item label="确认密码">
              {getFieldDecorator("checkPassword", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入确认密码",
                  },
                ],
                initialValue: "12345678", // 初始值
              })(
                <Input
                  type="checkPassword"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={getSendcode}
                className="login-form-button"
              >
                获取验证码
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                注册
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                  type="link"
                  className="login-form-button"
                >
                  <Link to="/login">登录已有账号</Link>
                </Button>
            </Form.Item>
          </Spin>
        </Form>
      </div>
    </DocumentTitle>
  );
};

const WrapLogin = Form.create()(Login);

export default connect((state) => state.user, { login, getUserInfo })(
  WrapLogin
);
