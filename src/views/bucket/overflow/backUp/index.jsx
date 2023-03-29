import React, { Component } from "react";
import { Button, Card, Dropdown, Icon, Menu, message, Table } from "antd";
import { backUpFile, backUpFileDelete, backUpFileResume } from "@/api/backup";
import { getParams } from "@/utils";

const { Column } = Table;

class User extends Component {
  state = {
    backupFiles: [],
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
    backUpFile({
      bucketId: obj.bucketId,
      bucketName: obj.bucketName,
      path: "/",
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          this.setState({
            backupFiles: data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
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

  /**
   * 删除文件
   * @param fileName
   */
  backUpFileDelete = (fileName) => {
    let { bucket } = this.state;
    backUpFileDelete({
      bucketId: bucket.bucketId,
      bucketName: bucket.bucketName,
      fileName: fileName,
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          message.success("删除成功");
          this.handleUploadOk();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  backUpFileResume = (fileName) => {
    let { bucket } = this.state;
    backUpFileResume({
      bucketId: bucket.bucketId,
      bucketName: bucket.bucketName,
      fileName: fileName,
    })
      .then((result) => {
        const { code, data } = result;
        if (code === 0) {
          message.success("恢复备份成功");
          this.handleUploadOk();
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
  handleGoPage = (url) => {
    let row = this.state.bucket;
    this.props.history.push(
      url +
        "?bucketId=" +
        row.bucketId +
        "&bucketName=" +
        row.bucketName +
        "&authority=" +
        row.authority
    );
  };

  componentDidMount() {
    let _obj = getParams(this.props.location.search);
    this.setState({
      bucket: _obj,
      bucketId: _obj.bucketId,
    });
    this.getFiles(_obj);
  }
  bucket;

  render() {
    const { backupFiles, selectedRowKeys } = this.state;
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
          style={{ marginRight: 20 + "px" }}
          type="primary"
          onClick={this.handleGoPage.bind(this, "/backUp")}
        >
          备份管理
        </Button>
        <Button
          type="primary"
          onClick={this.handleGoPage.bind(this, "/spaceSet")}
        >
          空间设置
        </Button>
      </span>
    );

    return (
      <div className="app-container">
        <br />
        <Card title={title}>
          <div>
            <Table
              bordered
              rowKey="objectName"
              dataSource={backupFiles}
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
                  menu = (
                    <Menu>
                      <Menu.Item
                        onClick={(eve) => {
                          this.backUpFileResume(row.objectName);
                        }}
                      >
                        恢复
                      </Menu.Item>
                      <Menu.Item
                        onClick={(eve) => {
                          this.backUpFileDelete(row.objectName);
                        }}
                      >
                        删除
                      </Menu.Item>
                    </Menu>
                  );
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
          </div>
        </Card>
      </div>
    );
  }
}

export default User;
