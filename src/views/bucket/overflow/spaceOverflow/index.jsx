import React, { Component } from "react";
import {
  Card,
  Button,
  Table,
  message,
  Divider,
  Descriptions,
  Dropdown,
  Space,
  Menu,
  Icon,
} from "antd";
import { Redirect, Link } from "react-router-dom";
import { bucketStatistics } from "@/api/bucket";
import { getParams, getNowMonthFirst, getNowMonthLast } from "@/utils";

const { Column } = Table;

class BucketDetail extends Component {
  state = {
    bucket: {},
    bucketId: 0,
    statistics: [],
  };
  /**
   * 获取令桶牌详情
   * @returns {Promise<void>}
   */
  getStatisticsData = async (obj) => {
    let fromArr = getNowMonthFirst().split("-");
    let toArr = getNowMonthLast().split("-");
    let from = {
      day: fromArr[2],
      month: fromArr[1],
      year: fromArr[0],
    };
    let to = {
      day: toArr[2],
      month: toArr[1],
      year: toArr[0],
    };
    const result = await bucketStatistics({
      bucketId: obj.bucketId,
      bucketName: obj.bucketName,
      from: from,
      to: to,
    });
    const { data, code } = result;
    if (code === 0) {
      this.setState({
        statistics: data,
      });
    }
  };

  /**
   * 加载存储桶详情接口
   */
  componentDidMount() {
    let _obj = getParams(this.props.location.search);
    this.setState({
      bucket: _obj,
      bucketId: _obj.bucketId,
    });
    console.log(this.props.location.search);
    this.getStatisticsData(_obj);
  }

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

  render() {
    const { statistics } = this.state;
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
    return (
      <div className="app-container">
        <br />
        <Card title={title}>
          {/*<div>*/}
          {/*    <Descriptions column={4}>*/}
          {/*        <Descriptions.Item label="存储量">11.86KB </Descriptions.Item>*/}
          {/*        <Descriptions.Item label="对象数">1810000000</Descriptions.Item>*/}
          {/*        <Descriptions.Item label="访问控制">私有 </Descriptions.Item>*/}
          {/*        <Descriptions.Item label="空间类型">自由空间</Descriptions.Item>*/}
          {/*    </Descriptions>*/}
          {/*    <Divider/>*/}
          {/*    <Descriptions>*/}
          {/*        <Descriptions.Item label="今日存储量">11.86KB </Descriptions.Item>*/}
          {/*        <Descriptions.Item label="今日文件数">1810000000</Descriptions.Item>*/}
          {/*        <Descriptions.Item label="本月API请求次数(GET/PUT)">0/1 </Descriptions.Item>*/}
          {/*        <Descriptions.Item label="昨日存储量">11.86KB </Descriptions.Item>*/}
          {/*        <Descriptions.Item label="昨日文件数">1810000000</Descriptions.Item>*/}
          {/*        <Descriptions.Item label="上月API请求次数(GET/PUT)">0/1 </Descriptions.Item>*/}
          {/*    </Descriptions>*/}
          {/*</div>*/}

          <Table
            bordered
            rowKey="id"
            dataSource={statistics}
            pagination={false}
          >
            <Column title="编号" dataIndex="id" key="id" align="center" />
            <Column
              title="空间名称"
              dataIndex="bucketName"
              key="bucketName"
              align="center"
            />
            <Column
              title="空间容量"
              dataIndex="memoryCapacity"
              key="memoryCapacity"
              align="center"
            />
            <Column
              title="获取次数"
              dataIndex="getNum"
              key="getNum"
              align="center"
            />
            <Column
              title="上传次数"
              dataIndex="putNum"
              key="putNum"
              align="center"
            />
            <Column title="年" dataIndex="year" key="year" align="center" />
            <Column title="月" dataIndex="month" key="month" align="center" />
            <Column title="日" dataIndex="day" key="day" align="center" />
          </Table>
        </Card>
      </div>
    );
  }
}

export default BucketDetail;
