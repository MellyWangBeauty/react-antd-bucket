import React, {Component} from "react";
import {Button, Card, Descriptions, Dropdown, Form, Icon, Input, Menu, message, Modal, Table} from "antd";
import {bucketFile, bucketFileDelete, bucketFileDownload, backup} from "@/api/bucket";
import {backupCreate, backupDelete, backupRecover} from "@/api/backup";
import {getParams} from "@/utils";
import UploadFile from "./forms/upload-file"
import AddCatogery from "./forms/add-catogery"

const {Column} = Table;

class User extends Component {
    state = {
        files: [],
        bucket: {},
        dir: '/',
        bucketId: 12,
        isBackup: false, // 是否备份管理
        currentRowData: {},
        uploadFile: false,
        addCatogery: false,
        tabValue: 1,
        selectedRowKeys: [],
        imageUrl: '',
        videoUrl: '',
    };
    getFiles = async (obj, path = '/', isBackup = false) => {
        if (isBackup) {
            backup({
                bucketId: obj.bucketId,
                bucketName: obj.bucketName,
                path: path
            }).then(result => {
                const {code, data} = result
                if (code === 0) {
                    this.setState({
                        files: data
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        } else {
            bucketFile({
                bucketId: obj.bucketId,
                bucketName: obj.bucketName,
                path: path
            }).then(result => {
                const {code, data} = result
                if (code === 0) {
                    this.setState({
                        files: data
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        }
    };
    handleCancel = _ => {
        this.setState({
            uploadFile: false,
            addCatogery: false,
        });
    };
    uploadFile = (row) => {
        this.setState({
            uploadFile: true,
        });
    };
    changeTab = (v) => {
        // console.log('v', v);
        // this.setState({
        //   tabValue: v
        // })
    };
    handleUploadOk = _ => {
        this.setState({
            uploadFile: false,
            addCatogery: false,
        });
        let {bucket, dir, isBackup} = this.state;
        this.getFiles(bucket, dir, isBackup)
    };
    createCatogery = () => {
        this.setState({
            addCatogery: true
        })
    };
    /**
     * 获取下载地址
     * @param fileName
     * @param callback
     */
    bucketFileDownload = (fileName, callback) => {
        let {bucket} = this.state
        bucketFileDownload({
            bucketId: bucket.bucketId,
            bucketName: bucket.bucketName,
            expireTime: 100001,
            fileName: fileName,
            path: "/"
        }).then(result => {
            const {code, data} = result
            if (code === 0) {
                if (callback) {
                    callback("http://" + data)
                } else {
                    window.open("http://" + data);
                }

            }
        }).catch(err => {
            console.log(err);
        })
    }

    // 复制
    copyCot = (cot) => {
        const pEle = document.createElement('p');
        pEle.innerHTML = cot || '';
        document.body.appendChild(pEle);
        const range = document.createRange(); // 创造range
        window.getSelection().removeAllRanges(); //清除页面中已有的selection
        range.selectNode(pEle); // 选中需要复制的节点
        window.getSelection().addRange(range); // 执行选中元素
        const copyStatus = document.execCommand("Copy"); // 执行copy操作
        message.success(copyStatus ? '复制外链成功' : '复制外链失败')
        document.body.removeChild(pEle);
        window.getSelection().removeAllRanges(); //清除页面中已有的selection
    }

    // 备份文件
    bucketFileBackup = (fileName) => {
        let {bucket} = this.state
        backupCreate({
            bucketId: bucket.bucketId,
            bucketName: bucket.bucketName,
            fileName: fileName,
        }).then(result => {
            const {code, data} = result
            if (code === 0) {
                message.success('备份成功！')
            }
        }).catch(err => {
            console.log(err);
        })
    }

    /**
     * 获取下载地址
     * @param dir
     */
    bucketDirUpload = (dir) => {
        this.setState({
            uploadFile: true,
            dir: dir
        });
    }
    /**
     * 删除文件
     * @param fileName
     */
    bucketFileDelete = (fileName) => {
        let {bucket} = this.state
        bucketFileDelete({
            bucketId: bucket.bucketId,
            bucketName: bucket.bucketName,
            fileName: fileName,
        }).then(result => {
            const {code, data} = result
            if (code === 0) {
                message.success("删除成功");
                this.handleUploadOk();
                console.log(data);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    /**
     * 备份恢复
     */
    backupRecovery = (fileName) => {
        let {bucket, isBackup, dir} = this.state
        backupRecover({
            bucketId: bucket.bucketId,
            bucketName: bucket.bucketName,
            fileName: fileName,
        }).then(result => {
            const {code, data} = result
            if (code === 0) {
                message.success('备份恢复成功能！');
                this.getFiles(bucket, dir, isBackup);
            }
        }).catch(err => {
            console.log(err);
        })
    };


    /**
     * 备份删除
     */
    backupDelete = (fileName) => {
        let {bucket, isBackup, dir} = this.state
        backupDelete({
            bucketId: bucket.bucketId,
            bucketName: bucket.bucketName,
            fileName: fileName,
        }).then(result => {
            const {code, data} = result
            if (code === 0) {
                message.success('备份删除成功！');
                this.getFiles(bucket, dir, isBackup);
            }
        }).catch(err => {
            console.log(err);
        })
    };

    /**
     * 打开存储桶详情
     * @param url
     * @param extra
     */
    handleGoPage = (url) => {
        let row = this.state.bucket;
        url = url + '?bucketId=' + row.bucketId + '&bucketName=' + row.bucketName + '&authority=' + row.authority;
        this.props.history.push(url)
    };

    /**
     * 查看目录下面的文件
     * @param dir
     */
    viewDirFiles = (dir) => {
        this.setState({
            dir: dir
        })
        let {bucket, isBackup} = this.state;
        this.getFiles(bucket, dir, isBackup)
    };

    handleBackPre = () => {
        this.viewDirFiles('/')
    };

    componentDidMount() {
        let {pathname} = this.props.location
        let _obj = getParams(this.props.location.search);
        let isBackup = pathname === '/backupMsg';
        this.setState({
            bucket: _obj,
            bucketId: _obj.bucketId,
            isBackup: isBackup
        })
        // this.setState({
        //     bucketId: this.props.location.query.id
        // })
        this.getFiles(_obj, '/', isBackup)
    };

    componentDidCatch(error, errorInfo) {
        console.log('==============', error, errorInfo);
    }

    render() {
        const {
            files,
            dir,
            isBackup,
            selectedRowKeys,
            imageUrl,
            videoUrl,
        } = this.state
        const title = (
            <span>
        <Button type='primary' onClick={this.handleGoPage.bind(this, "/spaceOverflow")}>空间概览</Button>
        <Button style={{marginLeft: 20 + 'px'}} type='primary'
                onClick={this.handleGoPage.bind(this, "/fileMsg")}>文件管理</Button>
        <Button style={{marginRight: 20 + 'px', marginLeft: 20 + 'px'}} type='primary'
                onClick={this.handleGoPage.bind(this, "/backupMsg")}>备份管理</Button>
        <Button type='primary' onClick={this.handleGoPage.bind(this, "/spaceSet")}>空间设置</Button>
      </span>
        )

        let t3 = "";
        let t2 = "";
        if (dir !== '/') {
            t3 = (
                <Button style={{marginLeft: 20 + 'px'}} type='primary'
                        onClick={this.handleBackPre.bind(this)}>返回根目录</Button>
            )
        }

        if (!isBackup) {
            t2 = (
                <span>
                <Button type='primary' onClick={this.uploadFile.bind(null)}>上传文件</Button>
                <Button style={{marginLeft: 20 + 'px'}} type='primary'
                        onClick={this.createCatogery.bind(null, 2)}>创建目录</Button>
                <Button style={{marginLeft: 20 + 'px'}} type='primary'
                        onClick={this.handleUploadOk.bind(this)}>刷新</Button>
                    {t3}
            </span>
            )
        }

        const rowSelection = {
            onChange: (newSelectedRowKeys) => {
                console.log('selectedRowKeys changed: ', newSelectedRowKeys);
            }
        };
        return (
            <div className="app-container">
                {/* <TypingCard title='用户管理' source={cardContent} /> */}
                <br/>

                <Card title={title}>
                    <div>
                        <Descriptions column={4}>
                            <Descriptions.Item label="标准存储">共1个文件 共11.86KB存储量</Descriptions.Item>
                        </Descriptions>

                        <Card title={t2}>
                            <Table bordered rowKey="objectName" dataSource={files} pagination={false}>
                                <Column title="空间名称" dataIndex="id" key="id" align="center"
                                        render={(text, record, index) => {
                                            return this.state.bucket.bucketName
                                        }}/>
                                <Column title="名称" dataIndex="objectName" key="objectName" align="center"/>
                                <Column title="是否目录" dataIndex="dir" key="dir" align="center"
                                        render={(text, record, index) => {
                                            return text ? '是' : '否'
                                        }}/>
                                <Column title="文件大小" dataIndex="size" key="size" align="center"/>
                                <Column title="操作" key="action" width={150} align="center" render={(text, row) => {
                                    let menu = "";
                                    if (row.dir) {
                                        menu = (<Menu>
                                            <Menu.Item onClick={eve => {
                                                this.viewDirFiles(row.objectName);
                                            }}>
                                                查看文件
                                            </Menu.Item>
                                            <Menu.Item onClick={eve => {
                                                this.bucketFileDelete(row.objectName);
                                            }}>
                                                删除
                                            </Menu.Item>
                                        </Menu>)
                                    } else {
                                        if (isBackup) {
                                            menu = (
                                                <Menu>
                                                    <Menu.Item onClick={eve => {
                                                        this.backupRecovery(row.objectName)
                                                    }}>
                                                        恢复备份
                                                    </Menu.Item>

                                                    <Menu.Item onClick={eve => {
                                                        this.backupDelete(row.objectName);
                                                    }}>
                                                        删除备份
                                                    </Menu.Item>
                                                </Menu>
                                            )
                                        } else {
                                            menu = (
                                                <Menu>
                                                    <Menu.Item onClick={eve => {
                                                        this.bucketFileDownload(row.objectName)
                                                    }}>
                                                        下载
                                                    </Menu.Item>

                                                    <Menu.Item onClick={eve => {
                                                        this.bucketFileBackup(row.objectName)
                                                    }}>
                                                        备份
                                                    </Menu.Item>

                                                    <Menu.Item onClick={eve => {
                                                        this.bucketFileDownload(row.objectName, (url) => {
                                                            this.copyCot(url)
                                                        })
                                                    }}>
                                                        复制外链
                                                    </Menu.Item>

                                                    <Menu.Item onClick={eve => {
                                                        this.bucketFileDelete(row.objectName);
                                                    }}>
                                                        删除
                                                    </Menu.Item>
                                                </Menu>
                                            )
                                        }
                                    }
                                    return (
                                        <span><Dropdown overlay={menu}><a
                                            onClick={event => event.stopPropagation()}>更多<Icon
                                            type="down"/></a></Dropdown></span>
                                    );
                                }}/>
                            </Table>
                        </Card>
                    </div>

                </Card>

                <UploadFile
                    wrappedComponentRef={formRef => this.uploadFileRef = formRef}
                    visible={this.state.uploadFile}
                    onCancel={this.handleCancel}
                    bucket={this.state.bucket}
                    dir={this.state.dir}
                    onOk={this.handleUploadOk}
                />
                <AddCatogery
                    wrappedComponentRef={formRef => this.addCatogeryRef = formRef}
                    visible={this.state.addCatogery}
                    bucket={this.state.bucket}
                    dir={this.state.dir}
                    onCancel={this.handleCancel}
                    onOk={this.handleUploadOk}
                />
            </div>
        );
    }
}

export default User;
