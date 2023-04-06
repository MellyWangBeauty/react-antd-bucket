import React, { Component } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Upload,
  message,
  Dropdown,
  Menu,
  Icon,
} from "antd";
import SparkMD5 from "spark-md5";
import $ from "jquery";
import { getToken } from "@/utils/auth";
import { getParams } from "@/utils";
import request from "@/utils/request";
import ReactEazyCrop from "./ReactEazyCrop";

const { Column } = Table;
//分片大小 5m
const chunkSize = 5 * 1024 * 1024;

class AddUserForm extends Component {
  state = {
    fileList: [],
    uploadFile: false,
    uploading: false,
    imageCrop: false,
  };
  // const uploadFileEle = document.querySelector("#uploadFile");

  // const request = axios.create({
  //   baseURL: "http://localhost:3000/upload",
  //   timeout: 10000,
  // });
  uploadFile = async (file, index) => {
    //获取用户选择的文件
    //const file = document.getElementById("upload").files[0];
    //文件大小(大于5m再分片哦，否则直接走普通文件上传的逻辑就可以了，这里只实现分片上传逻辑)
    const fileSize = file.size;

    if (fileSize <= chunkSize) {
      console.log("上传的文件大于5m才能分片上传");
    }

    //计算当前选择文件需要的分片数量
    const chunkCount = Math.ceil(fileSize / chunkSize);
    console.log(
      "文件大小：",
      file.size / 1024 / 1024 + "Mb",
      "分片数：",
      chunkCount
    );

    //获取文件md5
    const fileMd5 = await this.getFileMd5(file);

    console.log("文件md5：", fileMd5);

    console.log("向后端请求本次分片上传初始化");
    //向后端请求本次分片上传初始化
    const initUploadParams = JSON.stringify({
      chunkSize: chunkSize,
      chunkNum: chunkCount,
      fileName: file.name,
      bucketName: this.props.bucket.bucketName,
      identifier: fileMd5,
      totalSize: fileSize,
    });

    request({
      url: "/file/multipart/create",
      method: "POST",
      headers: {
        bucketId: this.props.bucket.bucketId,
      },
      data: initUploadParams,
    }).then(async (res) => {
      console.log(res);
      //code = 0 文件在之前已经上传完成，直接走秒传逻辑；code = 1 文件上传过，但未完成，走续传逻辑;code = 200 则仅需要合并文件
      if (res.code === 200) {
        console.log("当前文件上传情况：所有分片已在之前上传完成，仅需合并");
        this.composeFile(
          res.data.uploadId,
          file.name,
          chunkCount,
          fileSize,
          file.contentType,
          fileMd5
        );
        return;
      }
      //
      // if (res.code === 0) {
      //     console.log("当前文件上传情况：秒传")
      //     console.log(res.data.filePath, res.data.suffix);
      //     return
      // }

      if (res.code === 0) {
        // console.log("当前文件上传情况：秒传")
        // videoPlay(res.data.filePath,res.data.suffix)
        console.log("当前文件上传情况：初次上传 或 断点续传");
        const chunkUploadUrls = res.data.chunks;

        //当前为顺序上传方式，若要测试并发上传，请将第52行 await 修饰符删除即可
        //若使用并发上传方式，当前分片上传完成后打印出来的完成提示是不准确的，但这并不影响最终运行结果；原因是由ajax请求本身是异步导致的
        for (let item of chunkUploadUrls) {
          //分片开始位置
          let start = (item.partNumber - 1) * chunkSize;
          //分片结束位置
          let end = Math.min(fileSize, start + chunkSize);
          //取文件指定范围内的byte，从而得到分片数据
          // debugger
          let _chunkFile = file.slice(start, end);
          console.log("开始上传第" + item.partNumber + "个分片");

          // await request({
          //     url: item.uploadUrl,
          //     method: 'PUT',
          //     headers: {
          //         bucketId: 12,
          //     },
          //     data: _chunkFile
          // }).then(res => {
          //     console.log("第" + item.partNumber + "个分片上传完成")
          // })

          await $.ajax({
            url: item.uploadUrl,
            type: "PUT",
            contentType: false,
            processData: false,
            data: _chunkFile,
            success: function (res) {
              console.log("第" + item.partNumber + "个分片上传完成");
            },
          });
        }
        // return
      }

      //请求后端合并文件
      this.composeFile(
        res.data.uploadId,
        file.name,
        chunkCount,
        fileSize,
        file.contentType,
        fileMd5
      );

      if (index === this.state.fileList.length - 1) {
        this.setState({
          uploading: false,
        });
        this.setFileList([]);
      }
    });
  };
  /**
   * 请求后端合并文件
   * @param fileMd5
   * @param fileName
   */
  composeFile = (
    uploadId,
    fileName,
    chunkSize,
    fileSize,
    contentType,
    identifier
  ) => {
    console.log("开始请求后端合并文件");
    //注意：bucketName请填写你自己的存储桶名称，如果没有，就先创建一个写在这
    const composeParams = JSON.stringify({
      uploadId: uploadId,
      fileName: fileName,
      chunkNum: chunkSize,
      fileSize: fileSize,
      contentType: contentType,
      expire: 12,
      maxGetCount: 2,
      bucketName: this.props.bucket.bucketName,
      identifier,
    });
    $.ajax({
      url: "http://localhost:3000/api/file/multipart/complete",
      headers: {
        authorization: getToken() || "",
        bucketId: this.props.bucket.bucketId,
      },
      type: "POST",
      contentType: "application/json",
      processData: false,
      data: composeParams,
      success: function (res) {
        console.log("合并文件完成", res.data);
      },
    });
  };
  /**
   * 获取文件MD5
   * @param file
   * @returns {Promise<unknown>}
   */
  getFileMd5 = (file) => {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    let spark = new SparkMD5();
    return new Promise((resolve) => {
      fileReader.onload = (e) => {
        spark.appendBinary(e.target.result);
        resolve(spark.end());
      };
    });
  };
  setFileList = (fileList) => {
    this.setState({
      fileList: fileList,
    });
  };

  uploadFiles = () => {
    const { fileList } = this.state;
    if (fileList.length === 0) {
      return;
    }
    this.setState({
      uploading: true,
    });
    fileList.forEach((file, index) => {
      this.uploadFile(file, index);
    });
  };

  handleCancel = () => {
    this.setState({ imageCrop: false });
  };

  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const { fileList, uploading } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const UploadProps = {
      onRemove: (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        this.setFileList(newFileList);
      },
      beforeUpload: (file) => {
        this.setFileList([...fileList, file]);
        return false;
      },
      fileList,
    };
    const handleOnOk = () => {
      this.uploadFiles();
      onOk();
      message.success("上传文件成功！");
    };
    const t2 = (
      <span>
        <Upload name="loGo" listType="picture" {...UploadProps}>
          <Button type="default">选择文件</Button>
        </Upload>
        <Button
          loading={uploading}
          style={{ marginTop: 20 + "px" }}
          type="primary"
          onClick={this.uploadFiles.bind(this)}
        >
          上传文件
        </Button>

        <Button
          style={{ marginLeft: 20 + "px" }}
          type="danger"
          onClick={this.setFileList.bind(this, [])}
        >
          清空文件
        </Button>
      </span>
    );
    return (
      <>
        <Modal
          title="上传文件"
          visible={visible}
          onCancel={onCancel}
          onOk={handleOnOk}
          confirmLoading={confirmLoading}
        >
          {/* {t2} */}
          <Card title={t2}>
            <Table
              bordered
              rowKey="name"
              dataSource={fileList}
              pagination={false}
            >
              <Column
                title="文件名"
                dataIndex="name"
                key="name"
                align="center"
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
                render={(text, row) => (
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          onClick={() => {
                            this.setState({ imageCrop: true });
                          }}
                        >
                          编辑
                        </Menu.Item>
                        <Menu.Item
                          onClick={UploadProps.onRemove.bind(this, row)}
                        >
                          删除
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <a onClick={(event) => event.stopPropagation()}>
                      更多
                      <Icon type="down" />
                    </a>
                  </Dropdown>
                )}
              />
            </Table>
          </Card>
        </Modal>
        <ReactEazyCrop
          visible={this.state.imageCrop}
          onCancel={this.handleCancel}
          onOk={this.handleCancel}
        />
      </>
    );
  }
}

export default Form.create({ name: "AddUserForm" })(AddUserForm);
