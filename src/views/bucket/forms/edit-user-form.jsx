import React, { Component } from "react";
import { Form, Input, Select, Modal, Radio } from "antd";
const { TextArea } = Input;
class EditUserForm extends Component {
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } =
      this.props;
    const { getFieldDecorator } = form;
    const { id, bucketName, authority } = currentRowData;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="编辑"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          {getFieldDecorator("id", {
            initialValue: id,
          })(<Input hidden disabled />)}
          <Form.Item label="空间名称:">
            {getFieldDecorator("bucketName", {
              // rules: [{ required: true, message: "请输入存储空间名称!" }],
              initialValue: bucketName,
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="访问控制:">
            {getFieldDecorator("authority", {
              initialValue: authority,
            })(
              <Radio.Group>
                <Radio value={1}>公开</Radio>
                <Radio value={0}>私有</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditUserForm" })(EditUserForm);
