import React, {Component} from "react";
import {Card, Button, message, Form, Input} from "antd";
import {bucketUpdate, deleteBucket} from "@/api/bucket";
import {getParams} from "@/utils";
import AddAuth from "./forms/add-auth";
// eslint-disable-next-line no-unused-vars
const {TextArea} = Input;

class User extends Component {
    state = {
        bucket: {},
        bucketId: 0,
        addAuth: false,
    };
    handleCancel = _ => {
        this.setState({
            addAuth: false,
        });
    };
    createAuth = () => {
        this.setState({
            addAuth: true
        })
    };
    /**
     * 操作
     * @param type
     */
    opBucket = (type) => {
        const {bucket} = this.state
        let req = {
            bucketId: bucket.bucketId,
            authority: 1,
            bucketName: bucket.bucketName,
        }
        if (type === 'update') {
            bucketUpdate(req).then((response) => {
                message.success("修改成功!")
            }).catch(e => {
                message.success("修改成功,请重试!")
            })
        } else {
            deleteBucket(bucket.bucketId).then(res => {
                message.success("删除成功")
                this.props.history.push('/bucket')
            })
        }
    }

    componentDidMount() {
        let _obj = getParams(this.props.location.search);
        this.setState({
            bucket: _obj,
            bucketId: _obj.bucketId
        })
    }

    /**
     * 打开存储桶详情
     * @param url
     * @param extra
     */
    handleGoPage = (url) => {
        let row = this.state.bucket;
        url = url + '?bucketId=' + row.bucketId + '&bucketName=' + row.bucketName + '&authority=' + row.authority;
        this.props.history.push(url)
    }

    render() {
        const title = (
            <span>
        <Button type='primary' onClick={this.handleGoPage.bind(this, "/spaceOverflow")}>空间概览</Button>
        <Button style={{marginLeft: 20 + 'px'}} type='primary'
                onClick={this.handleGoPage.bind(this, "/fileMsg")}>文件管理</Button>
        <Button style={{marginRight: 20 + 'px', marginLeft: 20 + 'px'}} type='primary'
                onClick={this.handleGoPage.bind(this, "/handleGoPage")}>备份管理</Button>
        <Button type='primary' onClick={this.handleGoPage.bind(this, "/spaceSet")}>空间设置</Button>
      </span>
        )
        const formItemLayout = {
            labelCol: {
                sm: {span: 4},
            },
            wrapperCol: {
                sm: {span: 16},
            },
        };
        return (
            <div className="app-container">
                {/* <TypingCard title='用户管理' source={cardContent} /> */}
                <br/>
                <Card title={title}>
                    <Form {...formItemLayout}>
                        <Form.Item label="访问控制">
                            <Button type="primary" onClick={this.opBucket.bind(this, 'update')}>修改为公开空间</Button>
                        </Form.Item>
                    </Form>
                    <Form {...formItemLayout}>
                        <Form.Item label="空间授权">
                            <Button type="primary" onClick={this.createAuth.bind(this)}>设置</Button>
                        </Form.Item>
                    </Form>
                    <Form {...formItemLayout}>
                        <Form.Item label="删除空间">
                            <Button type="primary" onClick={this.opBucket.bind(this, 'delete')}>删除空间</Button>
                        </Form.Item>
                    </Form>
                    {/*<Form {...formItemLayout}>*/}
                    {/*    <Form.Item label="空间备注">*/}
                    {/*        <TextArea rows={4} placeholder="请输入空间备注"/>*/}
                    {/*    </Form.Item>*/}
                    {/*    <Form.Item wrapperCol={{offset: 4}}>*/}
                    {/*        <Button type="primary">确定</Button>*/}
                    {/*    </Form.Item>*/}
                    {/*</Form>*/}
                </Card>

                <AddAuth
                    wrappedComponentRef={formRef => this.addAuthRef = formRef}
                    visible={this.state.addAuth}
                    bucket={this.state.bucket}
                    // confirmLoading={this.state.addUserModalLoading}
                    onCancel={this.handleCancel}
                    onOk={this.handleCancel}
                />
            </div>
        );
    }
}

export default User;
