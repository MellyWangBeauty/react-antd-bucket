import React, { Component } from "react";
import {
  Button,
  Card,
  Descriptions,
  Dropdown,
  Icon,
  Menu,
  message,
  Table,
} from "antd";
import {
  bucketFile,
  bucketFileDelete,
  bucketFileDownload,
  bucketFileBackup,
} from "@/api/bucket";
import { getParams } from "@/utils";
import UploadFile from "./forms/upload-file";
import AddCatogery from "./forms/add-catogery";
import copy from "copy-to-clipboard";

const { Column } = Table;

class User extends Component {
  state = {
    files: [],
    bucket: {},
    dir: "/",
    bucketId: 12,
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    uploadFile: false,
    addCatogery: false,
    addUserModalLoading: false,
    tabValue: 1,
    selectedRowKeys: [],
  };

  getFiles = async (obj) => {
    bucketFile({
      bucketId: obj.bucketId,
      bucketName: obj.bucketName,
      path: "/",
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          this.setState({
            files: data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getDirFiles = async (obj) => {
    let { bucket } = this.state;
    bucketFile({
      bucketId: bucket.bucketId,
      bucketName: bucket.bucketName,
      path: "/" + obj.objectName,
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          console.log("data", data);
          this.setState({
            files: data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleCancel = (_) => {
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
  handleUploadOk = (_) => {
    this.setState({
      uploadFile: false,
      addCatogery: false,
    });
    this.getFiles(this.state.bucket);
  };
  createCatogery = () => {
    this.setState({
      addCatogery: true,
    });
  };
  /**
   * 获取下载地址
   * @param fileName
   */
  bucketFileDownload = (fileName) => {
    let { bucket } = this.state;
    bucketFileDownload({
      bucketId: bucket.bucketId,
      bucketName: bucket.bucketName,
      expireTime: 100001,
      fileName: fileName,
      path: "/",
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          window.open("http://" + data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  bucketFileLink = (fileName) => {
    let { bucket } = this.state;
    bucketFileDownload({
      bucketId: bucket.bucketId,
      bucketName: bucket.bucketName,
      expireTime: 100001,
      fileName: fileName,
      path: "/",
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          copy("http://" + data);
          message.success("已成功复制链接");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  bucketFileBackup = (fileName) => {
    let { bucket } = this.state;
    bucketFileBackup({
      bucketId: bucket.bucketId,
      bucketName: bucket.bucketName,
      fileName: fileName,
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          message.success("备份成功");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  bucketDirUpload = (dir) => {
    this.setState({
      uploadFile: true,
      dir: dir,
    });
  };
  /**
   * 删除文件
   * @param fileName
   */
  bucketFileDelete = (fileName) => {
    let { bucket } = this.state;
    bucketFileDelete({
      bucketId: bucket.bucketId,
      bucketName: bucket.bucketName,
      fileName: fileName,
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          message.success("删除成功");
          this.handleUploadOk();
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  /**
   * 打开存储桶详情
   * @param url
   * @param row
   */
  handleGoPage = (url, text) => {
    let row = this.state.bucket;
    const { objectName, dir } = text;
    if (dir) {
      this.props.history.push(
        url +
          "?bucketId=" +
          row.bucketId +
          "&bucketName=" +
          row.bucketName +
          "&authority=" +
          row.authority +
          "&objectName=" +
          objectName
      );
    } else {
      this.props.history.push(
        url +
          "?bucketId=" +
          row.bucketId +
          "&bucketName=" +
          row.bucketName +
          "&authority=" +
          row.authority
      );
    }
  };

  componentDidMount() {
    let _obj = getParams(this.props.location.search);
    this.setState({
      bucket: _obj,
      bucketId: _obj.bucketId,
    });
    this.getFiles(_obj);
  }

  render() {
    const { files, selectedRowKeys } = this.state;
    const title = (
      <span>
        <Button
          type="primary"
          onClick={this.handleGoPage.bind(this, "/spaceOverflow")}
        >
          空间概览
        </Button>
        <Button
          style={{ marginRight: 20 + "px", marginLeft: 20 + "px" }}
          type="primary"
          onClick={this.handleGoPage.bind(this, "/fileMsg")}
        >
          文件管理
        </Button>
        <Button
          type="primary"
          onClick={this.handleGoPage.bind(this, "/spaceSet")}
        >
          空间设置
        </Button>
        <Button
          style={{ marginRight: 20 + "px", marginLeft: 20 + "px" }}
          type="primary"
          onClick={this.handleGoPage.bind(this, "/backUp")}
        >
          备份管理
        </Button>
      </span>
    );
    const t2 = (
      <span>
        <Button type="primary" onClick={this.uploadFile.bind(null)}>
          上传文件
        </Button>
        <Button
          style={{ marginLeft: 20 + "px" }}
          type="primary"
          onClick={this.createCatogery.bind(null, 2)}
        >
          创建目录
        </Button>
        {/*<Button type='primary' onClick={this.createCatogery.bind(null, 2)}>批量操作</Button>*/}
        <Button
          style={{ marginRight: 20 + "px", marginLeft: 20 + "px" }}
          type="primary"
          onClick={this.handleUploadOk.bind(this)}
        >
          刷新
        </Button>
      </span>
    );
    const rowSelection = {
      onChange: (newSelectedRowKeys) => {
        console.log("selectedRowKeys changed: ", newSelectedRowKeys);
      },
    };
    return (
      <div className="app-container">
        {/* <TypingCard title='用户管理' source={cardContent} /> */}
        <br />

        <Card title={title}>
          <div>
            <Descriptions column={4}>
              <Descriptions.Item label="标准存储">
                共1个文件 共11.86KB存储量
              </Descriptions.Item>
            </Descriptions>

            <Card title={t2}>
              <Table
                bordered
                rowKey="objectName"
                dataSource={files}
                pagination={false}
              >
                <Column
                  title="空间名称"
                  dataIndex="id"
                  key="id"
                  align="center"
                  render={(text, record, index) => {
                    return this.state.bucket.bucketName;
                  }}
                />
                <Column
                  title="名称"
                  dataIndex="objectName"
                  key="objectName"
                  align="center"
                />
                <Column
                  title="是否目录"
                  dataIndex="dir"
                  key="dir"
                  align="center"
                  render={(text, record, index) => {
                    return text ? "是" : "否";
                  }}
                />
                <Column
                  title="文件大小"
                  dataIndex="size"
                  key="size"
                  align="center"
                />
                <Column
                  title="操作"
                  key="action"
                  width={150}
                  align="center"
                  render={(text, row) => {
                    let menu = "";
                    if (row.dir) {
                      menu = (
                        <Menu>
                          <Menu.Item
                            onClick={(eve) => {
                              this.getDirFiles(text);
                            }}
                          >
                            进入
                          </Menu.Item>
                          <Menu.Item
                            onClick={(eve) => {
                              this.bucketFileDelete(row.objectName);
                            }}
                          >
                            删除
                          </Menu.Item>
                        </Menu>
                      );
                    } else {
                      menu = (
                        <Menu>
                          <Menu.Item
                            onClick={(eve) => {
                              this.bucketFileDownload(row.objectName);
                            }}
                          >
                            下载
                          </Menu.Item>
                          <Menu.Item
                            onClick={(eve) => {
                              this.bucketFileBackup(row.objectName);
                            }}
                          >
                            备份
                          </Menu.Item>
                          <Menu.Item
                            onClick={(eve) => {
                              this.bucketFileLink(row.objectName);
                            }}
                          >
                            复制链接
                          </Menu.Item>
                          <Menu.Item
                            onClick={(eve) => {
                              this.bucketFileDelete(row.objectName);
                            }}
                          >
                            删除
                          </Menu.Item>
                        </Menu>
                      );
                    }

                    return (
                      <span>
                        <Dropdown overlay={menu}>
                          <a onClick={(event) => event.stopPropagation()}>
                            更多
                            <Icon type="down" />
                          </a>
                        </Dropdown>
                      </span>
                    );
                  }}
                />
              </Table>
            </Card>
          </div>
        </Card>
        {/* <EditUserForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editUserFormRef = formRef}
          visible={this.state.editUserModalVisible}
          confirmLoading={this.state.editUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
        /> */}
        <UploadFile
          wrappedComponentRef={(formRef) => (this.uploadFileRef = formRef)}
          visible={this.state.uploadFile}
          // confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
          bucket={this.state.bucket}
          dir={this.state.dir}
          onOk={this.handleUploadOk}
        />
        <AddCatogery
          wrappedComponentRef={(formRef) => (this.addCatogeryRef = formRef)}
          visible={this.state.addCatogery}
          bucket={this.state.bucket}
          dir={this.state.dir}
          // confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleUploadOk}
        />
      </div>
    );
  }
}

export default User;
