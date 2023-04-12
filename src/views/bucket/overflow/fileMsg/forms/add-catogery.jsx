import React, { Component } from "react";
import { Form, Input, Select, Modal, Radio, message } from "antd";
import { bucketFileCreateDir } from "@/api/bucket";

const { TextArea } = Input;

class AddUserForm extends Component {
  state = {
    dirName: "",
  };
  createDir = () => {
    const { dirName } = this.state;
    if (!dirName) {
      message.error("请输入目录名");
      return;
    }
    const { bucket, onOk, dir } = this.props;
    // console.log("dir", dir);
    bucketFileCreateDir({
      bucketId: bucket.bucketId,
      bucketName: bucket.bucketName,
      dirName: dirName,
      path: dir,
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          console.log(data);
          if (onOk) onOk();
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
        title="创建目录"
        visible={visible}
        onCancel={onCancel}
        onOk={this.createDir.bind(this)}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="目录名:">
            {getFieldDecorator("id", {
              rules: [{ required: true }],
            })(
              <Input
                placeholder="请输入目录名"
                onChange={(event) => {
                  this.setState({
                    dirName: event.target.value,
                  });
                }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddUserForm" })(AddUserForm);
