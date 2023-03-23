import React, {Component} from "react";
import {Form, Input, Select, Modal, Radio, message} from "antd";
import {bucketGrant} from "@/api/bucket";

class AddUserForm extends Component {
    state = {
        email: "",
        type: 0,
    };
    validateUser = async (rule, value, callback) => {
        if (value) {
            if (!/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/.test(value)) {
                callback("邮箱格式错误！");
            }
        } else {
            callback("请输入用户邮箱！");
        }
        callback();
    };
    /**
     * 授权操作
     */
    createAuth = () => {
        const {email, type} = this.state
        if (!email || !type) {
            message.error('授权信息填写不完整！')
            return;
        }
        const {bucket, onOk} = this.props
        bucketGrant({
            bucketId: parseInt(bucket.bucketId),
            email: email,
            type: type,
        }).then((response) => {
            console.log(response)
            message.success("授权成功!")
            if (onOk) onOk()
        }).catch(e => {
            message.success("授权失败,请重试!")
        })
    };

    render() {
        const {visible, onCancel, form, confirmLoading} = this.props;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                sm: {span: 6},
            },
            wrapperCol: {
                sm: {span: 16},
            },
        };
        return (
            <Modal
                title="新增授权"
                visible={visible}
                onCancel={onCancel}
                onOk={this.createAuth}
                confirmLoading={confirmLoading}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="授权用户:">
                        {getFieldDecorator("email", {
                            rules: [{required: true, validator: this.validateUser}],
                        })(<Input placeholder="请输入授权用户邮箱" onChange={(event) => {
                            this.setState({
                                email: event.target.value
                            })
                        }}/>)}
                    </Form.Item>
                    <Form.Item label="授予权限:">
                        {getFieldDecorator("type")(
                            <Radio.Group
                                onChange={(event) => {
                                    this.setState({
                                        type: event.target.value
                                    })
                                }}
                            >
                                <Radio value={1}>只读</Radio>
                                <Radio value={2}>读写</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create({name: "AddUserForm"})(AddUserForm);
