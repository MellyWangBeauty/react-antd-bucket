import React, { Component } from "react";
import { Card, Button, Table, Modal, Form, message, Input } from "antd";
import { Link } from "react-router-dom";
import { applyKey, reqUserInfo, removeKey } from "@/api/user";
const { Column } = Table;

class AddUserForm extends Component {
  state = {
    secretKey: "",
    accessKey: "",
  };

  handleApplyKey = () => {
    applyKey().then((response) => {
      this.reqKey();
      message.success("申请成功!");
    });
  };

  handleRemoveKey = () => {
    removeKey().then((response) => {
      message.success("删除成功!");
    });
    this.setState({
      secretKey: "",
      accessKey: "",
    });
  };

  reqKey = () => {
    reqUserInfo()
      .then((response) => {
        const data = response;
        if (data.code === 0) {
          const userInfo = data.data;
          //   console.log("reqUserInfo", userInfo);
          this.setState({
            secretKey: userInfo.secretKey,
            accessKey: userInfo.accessKey,
          });
        } else {
          const msg = data.message;
        }
      })
      .catch((error) => {});
  };

  componentDidMount() {
    this.reqKey();
  }

  render() {
    const { visible, onCancel, onOk, gds } = this.props;
    const { accessKey, secretKey } = this.state;
    return (
      <Modal title="我的密钥" visible={visible} onCancel={onCancel} onOk={onOk}>
        <Button
          type="primary"
          style={{ marginBottom: 10 + "px" }}
          onClick={this.handleApplyKey}
        >
          申请密钥
        </Button>
        <Button
          type="danger"
          style={{ marginLeft: 10 + "px" }}
          onClick={this.handleRemoveKey}
        >
          删除密钥
        </Button>
        <Card>
          <Form>
            <Form.Item label="accessKey">
              <Input value={accessKey} placeholder="请点击申请密钥获取" />
            </Form.Item>
            <Form.Item label="secrectKey">
              <Input value={secretKey} placeholder="请点击申请密钥获取" />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddUserForm" })(AddUserForm);
