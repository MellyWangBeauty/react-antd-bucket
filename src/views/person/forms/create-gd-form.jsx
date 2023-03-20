import React, { Component } from "react";
import { Form, Input, Select, Modal, Radio,Upload,Button,message} from "antd";
import { reqValidatUserID } from "@/api/user";
const { TextArea } = Input;
class AddUserForm extends Component {
  validatEmail = async (rule, value, callback) => {
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
      callback("请输入邮箱");
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
    const props = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <Modal
        title="创建工单"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        width={800}
      >
        <Form {...formItemLayout}>
          <Form.Item label="标题:">
            {getFieldDecorator("title", {
              rules: [{ required: true, message: '请输入标题' }],
            })(<Input placeholder="请输入标题" />)}
          </Form.Item>
          <Form.Item label="分类:">
            {getFieldDecorator("type", {
              rules: [{ required: true, message: '请输入分类' }],
            })(<Input placeholder="请输入分类" />)}
          </Form.Item>
          <Form.Item label="问题描述:">
            {getFieldDecorator("content", {
              rules: [{ required: true,  message: '请输入问题描述' }],
            })(<TextArea placeholder="请输入问题描述" />)}
          </Form.Item>
          <Form.Item label="邮箱:">
            {getFieldDecorator("email", {
              rules: [{ required: true,  message: '请输入邮箱' }],
            })(<Input placeholder="请输入邮箱" />)}
          </Form.Item>
          {/* <Form.Item label="上传文件:">
            {getFieldDecorator("file", {
              rules: [{ required: true,  message: '上传文件' }],
            })(
              <Upload {...props}>
                <Button >上传</Button> 如截屏、活动日志或文件（txt，jpg，png，pdf）
              </Upload>
            )}
          </Form.Item> */}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddUserForm" })(AddUserForm);
