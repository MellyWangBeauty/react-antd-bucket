import React, { Component } from "react";
import { Card, Button, Table, Modal, Form } from "antd";
import { Link } from "react-router-dom";
import { reqValidatUserID } from "@/api/user";
const { Column } = Table;
class AddUserForm extends Component {
  state = {
    users: [],
    uploadFile: false,
  };
  uploadFile = (row) => {
    this.setState({
      uploadFile: true,
    });
  };
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const {users} =this.state
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const t2 = (
      <span>
        <Button type='primary' onClick={this.uploadFile.bind(null)}>选择文件</Button>
        <Button style={{ marginRight: 20 + 'px', marginLeft: 20 + 'px' }} type='primary'>清空文件</Button>
      </span>
    )
    return (
      <Modal
        title="我的工单"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Table bordered rowKey="id" dataSource={users} pagination={false} >
            <Column title="编号" dataIndex="name" key="name" align="center" />
            <Column title="标题" dataIndex="role" key="role" align="center" />
            <Column title="分类" dataIndex="role" key="role" align="center" />
            <Column title="状态" dataIndex="role" key="role" align="center" />
            <Column title="创建时间" dataIndex="role" key="role" align="center" />
            
          </Table>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddUserForm" })(AddUserForm);
