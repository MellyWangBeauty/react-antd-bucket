import React, { Component } from "react";
import { Card, Button, Table, Modal, Form } from "antd";
import { Link } from "react-router-dom";
import { reqValidatUserID, getMyGd, reqUserInfo } from "@/api/user";
const { Column } = Table;

class AddUserForm extends Component {
  state = {
    uploadFile: false,
    users: {},
  };
  uploadFile = (row) => {
    this.setState({
      uploadFile: true,
    });
  };

  render() {
    const { visible, onCancel, onOk, form, confirmLoading, gds } = this.props;
    return (
      <Modal
        title="我的工单"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Table bordered rowKey="id" dataSource={gds} pagination={false}>
          <Column title="编号" dataIndex="id" key="id" align="center" />
          <Column title="标题" dataIndex="title" key="title" align="center" />
          <Column title="分类" dataIndex="type" key="type" align="center" />
          <Column
            title="状态"
            dataIndex="status"
            key="status"
            align="center"
            render={(authority) => {
              return authority === 1 ? "已处理" : "待处理";
            }}
          />
        </Table>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddUserForm" })(AddUserForm);
