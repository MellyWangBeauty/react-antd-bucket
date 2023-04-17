import React, { Component } from "react";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Icon,
  Menu,
  Modal,
  Table,
  Tooltip,
  Upload,
  message,
} from "antd";
import SparkMD5 from "spark-md5";
import $ from "jquery";
import { getToken } from "@/utils/auth";
import { getGcd, formatSeconds } from "@/utils";
import request from "@/utils/request";
import CropVideo from "./crop-video";
import CropShowImg from "./crop-image";

import FFmpeg from "@ffmpeg/ffmpeg";

const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
});
// console.log("ffmpeg", ffmpeg, ffmpeg.isLoaded());
if (!ffmpeg.isLoaded()) {
  ffmpeg
    .load()
    .then(() => {
      console.log(ffmpeg.isLoaded());
    })
    .catch((err) => {
      console.log(err);
    });
}

const { Column } = Table;
//分片大小 5m
const chunkSize = 5 * 1024 * 1024;

class AddUserForm extends Component {
  constructor(props) {
    super(props);
    // 创建Ref
    this.cropVideoRef = React.createRef();
    this.cropImageRef = React.createRef();
  }

  state = {
    fileList: [],
    uploadFile: false,
    uploading: false,
    showCropper: false,
    cropImageUrl: "",
    currentFileIndex: null,
    ff: {
      name: "",
      file: null,
      newName: "newVideo.mp4",
      videoUrl: "",
      newVideoUrl: "",
      blob: null,
      frames: [],
      duration: 0,
    },
    cut: {
      spliterEndTime: "00:00:50.0",
      imgs: new Array(20),
      startTime: "00:00:00.0",
      endTime: "00:00:50.0",
      show: false,
      duration: 0,
    },
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
    const { dir } = this.props;
    //向后端请求本次分片上传初始化
    const initUploadParams = JSON.stringify({
      chunkSize: chunkSize,
      chunkNum: chunkCount,
      fileName: dir === "/" ? file.name : dir + file.name,
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
    const { dir } = this.props;
    //注意：bucketName请填写你自己的存储桶名称，如果没有，就先创建一个写在这
    const composeParams = JSON.stringify({
      uploadId: uploadId,
      fileName: dir == "/" ? fileName : dir + fileName,
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

  // 剪切视频操作
  cropVideo = async (file, index) => {
    let { ff, cut } = this.state;
    let name = file.name;
    let orgFileBuffer = await file.arrayBuffer(); // 获取文件数据
    ffmpeg.FS("writeFile", name, await fetchFile(new Blob([orgFileBuffer]))); // 将视频数据写入内存
    let videoUrl = URL.createObjectURL(new Blob([orgFileBuffer])); // 将视频数据转为url
    let { duration } = await this.checkSize(file);
    let _time = formatSeconds(duration);
    Object.assign(ff, {
      videoUrl,
      name,
      file,
      duration,
      frames: [],
    });
    cut.show = true;
    cut.endTime = _time;
    cut.spliterEndTime = _time;
    this.setState({
      ff: ff,
      cut: cut,
      currentFileIndex: index,
    });
  };

  /**
   * 显示裁剪图片
   * @param file
   * @param index
   */
  cropImage = async (file, index) => {
    let { showCropper, cropImageUrl } = this.state;
    let orgFileBuffer = await file.arrayBuffer(); // 获取文件数据
    cropImageUrl = URL.createObjectURL(new Blob([orgFileBuffer])); // 将视频数据转为url
    showCropper = true;
    this.setState({
      showCropper: showCropper,
      cropImageUrl: cropImageUrl,
      currentFileIndex: index,
    });
  };

  /**
   * 裁剪视频取消
   * @param arr
   */
  onCropVideoCancel = () => {
    let { cut } = this.state;
    cut.show = false;
    this.setState({
      cut: cut,
    });
  };

  /**
   * 裁剪时间确定
   */
  onCropVideoOk = async () => {
    let { ff, cut, currentFileIndex, fileList } = this.state;
    cut.show = false;
    this.setState({
      cut: cut,
    });
    let arr = this.cropVideoRef.current.onSureCut();
    let startTime = this.timeToSecond(arr[0]),
      endTime = this.timeToSecond(arr[1]);
    try {
      // showLoading();
      let { name, newName } = ff;
      await ffmpeg.run(
        "-ss",
        `${startTime}`,
        "-t",
        `${endTime - startTime}`,
        "-i",
        name,
        "-vcodec",
        "copy",
        "-acodec",
        "copy",
        newName
      );
      let arrayBuffer = ffmpeg.FS("readFile", newName).buffer; // 读取缓存
      let blob = new Blob([arrayBuffer]);
      ff.newVideoUrl = URL.createObjectURL(blob); // 转为Blob URL
      ff.blob = blob; //上传文件用

      let newFile = new File([blob], ff.file.name, {
        type: ff.file.type,
        lastModified: Date.now(),
      });
      newFile.uid = ff.file.uid;
      // console.log(ff.blob, newFile);

      // 完成裁剪替换
      fileList[currentFileIndex] = newFile;

      // console.log(fileList);

      this.setState({
        fileList: fileList,
      });
      // this.cut.show = false;
      // hideLoading();
    } catch (err) {
      // console.log("切视频err", err);
      throw err;
    }
  };

  /**
   * 裁剪图片取消
   */
  onCropImageCancel = () => {
    this.setState({
      showCropper: false,
      cropImageUrl: "",
    });
  };

  /**
   * 裁剪图片确定
   */
  onCropImageOk = () => {
    let { showCropper, cropImageUrl, fileList, currentFileIndex } = this.state;
    showCropper = false;
    cropImageUrl = "";
    let blob = this.cropImageRef.current.func();
    if (!blob) {
      message.error("请先生成剪切结果！");
      return false;
    }
    let _file = fileList[currentFileIndex];
    let newFile = new File([blob], _file.name, {
      type: _file.type,
      lastModified: Date.now(),
    });
    newFile.uid = _file.uid;
    fileList[currentFileIndex] = newFile;
    this.setState({
      showCropper: showCropper,
      cropImageUrl: cropImageUrl,
      fileList: fileList,
    });
  };

  timeToSecond = (time) => {
    let hour = time.split(":")[0],
      min = time.split(":")[1],
      sec = time.split(":")[2];
    return Number(hour * 3600) + Number(min * 60) + Number(sec);
  };

  // 创建虚拟dom 并且放回对应的值
  checkSize = async (file, isVideo) => {
    if (!file) return false;
    const checktimevideo = document.getElementById("checktimevideo");
    if (checktimevideo) {
      document.body.removeChild(checktimevideo);
    }
    let doms;
    if (!isVideo) {
      doms = document.createElement("video");
    } else {
      doms = document.createElement("audio");
    }
    const url = URL.createObjectURL(file);
    console.log(url);
    doms.src = url;
    doms.id = "checktimevideo";
    doms.style.display = "none";
    document.body.appendChild(doms);
    return await this.gettime(doms);
  };

  gettime = (doms) => {
    // 由于loadedmetadata 是异步代码所以需要promise进行封装转换为同步代码执行
    return new Promise((resolve) => {
      doms.addEventListener("loadedmetadata", (e) => {
        const gcd = getGcd(e.target.videoWidth, e.target.videoHeight);
        // console.log(gcd)
        let obj = {
          width: doms.videoWidth, // 尺寸宽 --- 分辨率
          height: doms.videoHeight, // 尺寸高
          duration: Number(e.target.duration.toFixed(2)), // 视频时长 1表示一秒
          ccbl: [e.target.videoWidth / gcd, e.target.videoHeight / gcd], // 计算尺寸比例
        };
        resolve(obj);
      });
    });
  };

  /**
   * 设置文件列表
   * @param fileList
   */
  setFileList = (fileList) => {
    console.log(fileList);
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

  render() {
    const { visible, onCancel, onOk, form, confirmLoading, dir } = this.props;
    const { getFieldDecorator } = form;
    const { fileList, uploading, ff, cut, showCropper, cropImageUrl } =
      this.state;
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
    const handleOnOk = () => {
      this.uploadFiles();
      onOk();
      message.success("上传文件成功！");
    };
    return (
      <div>
        <Modal
          title="上传文件"
          visible={visible}
          onCancel={onCancel}
          onOk={handleOnOk}
          confirmLoading={confirmLoading}
        >
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
                onCell={() => {
                  return {
                    style: {
                      maxWidth: 150,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                    },
                  };
                }}
                render={(text, row) => {
                  return (
                    <Tooltip placement="topLeft" title={text}>
                      {text}
                    </Tooltip>
                  );
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
                render={(text, row, index) => {
                  let filename = row.name; //文件路径地址
                  let index1 = filename.lastIndexOf(".");
                  let index2 = filename.length;
                  let postf = filename.substring(index1, index2); //获取文bai件后缀名duzhi
                  //判断文件后缀名是否等于视频文件的后缀名
                  const isVideo =
                    postf === ".avi" || postf === ".mp4" || postf === ".rmvb";
                  let menu = "";
                  if (isVideo) {
                    menu = (
                      <Menu>
                        <Menu.Item
                          onClick={(eve) => {
                            this.cropVideo(row, index);
                          }}
                        >
                          剪切
                        </Menu.Item>
                        <Menu.Item
                          onClick={(eve) => {
                            UploadProps.onRemove(row);
                          }}
                        >
                          移除
                        </Menu.Item>
                      </Menu>
                    );
                  } else {
                    menu = (
                      <Menu>
                        <Menu.Item
                          onClick={(eve) => {
                            this.cropImage(row, index);
                          }}
                        >
                          裁剪
                        </Menu.Item>
                        <Menu.Item
                          onClick={(eve) => {
                            UploadProps.onRemove(row);
                          }}
                        >
                          移除
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
        </Modal>

        <Modal
          title="剪切视频"
          visible={cut.show}
          onCancel={this.onCropVideoCancel.bind(this)}
          onOk={this.onCropVideoOk.bind(this)}
          width={1200}
        >
          <CropVideo
            videoUrl={ff.videoUrl}
            startTime={cut.startTime}
            endTime={cut.endTime}
            spliterEndTime={cut.spliterEndTime}
            ffVideo={ff}
            ref={this.cropVideoRef}
          />
        </Modal>

        <Modal
          title="裁剪图片"
          visible={showCropper}
          onCancel={this.onCropImageCancel.bind(this)}
          onOk={this.onCropImageOk.bind(this)}
          width={1000}
        >
          <CropShowImg imageUrl={cropImageUrl} ref={this.cropImageRef} />
        </Modal>
      </div>
    );
  }
}

export default Form.create({ name: "AddUserForm" })(AddUserForm);
