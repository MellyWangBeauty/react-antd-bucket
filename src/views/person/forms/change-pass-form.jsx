import React, { Component } from "react";
import { Form, Input, Select, Modal, Radio } from "antd";
import { reqValidatUserID } from "@/api/user";
const { TextArea } = Input;
class AddUserForm extends Component {
  validatPass = async (rule, value, callback) => {
    if (value) {
      // if (!/^[a-zA-Z0-9]{1,6}$/.test(value)) {
      //   callback("用户ID必须为1-6位数字或字母组合");
      // }
      // let res = await reqValidatUserID(value);
      // const { status } = res.data;
      // if (status) {
      //   callback("该用户ID已存在");
      // }
      callback();
    } else {
      callback("请输入您的密码");
    }
    callback();
  };
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="修改密码"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="密码:">
            {getFieldDecorator("newPassword", {
              rules: [{ required: true, validator: this.validatPass }],
            })(<Input placeholder="请输入新密码" />)}
          </Form.Item>
          <Form.Item label="确认密码:">
            {getFieldDecorator("checkPassword", {
              rules: [{ required: true, validator: this.validatPass }],
            })(<Input placeholder="请确认新密码" />)}
          </Form.Item>
          {/* <Form.Item label="用户角色:">
            {getFieldDecorator("role", {
              initialValue: "admin",
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="admin">admin</Select.Option>
                <Select.Option value="guest">guest</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="用户描述:">
            {getFieldDecorator("description", {
            })(<TextArea rows={4} placeholder="请输入用户描述" />)}
          </Form.Item> */}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddUserForm" })(AddUserForm);
