import moment from 'moment';
import React, {Component} from "react";
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
    Form,
    Row,
    Col,
    DatePicker
} from "antd";
import {Redirect, Link} from "react-router-dom";
import {bucketStatistics} from "@/api/bucket";
import {getParams, getNowMonthFirst, getNowMonthLast} from "@/utils";
import echarts from "@/lib/echarts";
import {debounce} from "@/utils";

const {Column} = Table;

class BucketDetail extends Component {
    state = {
        bucket: {},
        bucketId: 0,
        statistics: [],
        chart: null,
        xAxisData: [],
        getNumData: [],
        putNumData: [],
        memoryCapacityData: [],
        startTime: '', // 开始时间
        endTime: '', // 结束时间
    };
    /**
     * 获取令桶牌详情
     * @returns {Promise<void>}
     */
    getStatisticsData = async (obj, dateArr, callback) => {
        let fromArr = [], toArr = [];
        if (dateArr) {
            fromArr = dateArr[0].split('-');
            toArr = dateArr[1].split('-');
        } else {
            fromArr = getNowMonthFirst().split('-');
            toArr = getNowMonthLast().split('-');
        }
        let from = {
            day: fromArr[2],
            month: fromArr[1],
            year: fromArr[0]
        }
        let to = {
            day: toArr[2],
            month: toArr[1],
            year: toArr[0]
        }
        const result = await bucketStatistics({bucketId: obj.bucketId, bucketName: obj.bucketName, from: from, to: to})
        const {data, code} = result
        if (code === 0) {
            let xAxisData = [], getNumData = [], putNumData = [], memoryCapacityData = [];
            data.forEach((item, index) => {
                xAxisData.push(item.year + '-' + item.month + '-' + item.day);
                getNumData.push(item.getNum);
                putNumData.push(item.putNum);
                // memoryCapacityData.push(this.bytesToSize(item.memoryCapacity));
            })

            this.setState({
                statistics: data,
                xAxisData: xAxisData,
                getNumData: getNumData,
                putNumData: putNumData,
                memoryCapacityData: memoryCapacityData,
            }, () => {
                callback()
            })
        }
    }

    bytesToSize = (bytes) => {
        if (bytes === 0) return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }

    /**
     * 加载存储桶详情接口
     */
    componentDidMount() {
        let _obj = getParams(this.props.location.search);
        this.setState({
            bucket: _obj,
            bucketId: _obj.bucketId
        })
        // console.log(this.props.location.search);
        this.getStatisticsData(_obj, null, () => {
            debounce(this.initChart.bind(this), 300)();
            window.addEventListener("resize", () => this.resize());
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sidebarCollapsed !== this.props.sidebarCollapsed) {
            this.resize();
        }
    }

    componentWillUnmount() {
        this.dispose();
    }


    resize() {
        const chart = this.state.chart;
        if (chart) {
            debounce(chart.resize.bind(this), 300)();
        }
    }

    dispose() {
        if (!this.state.chart) {
            return;
        }
        window.removeEventListener("resize", () => this.resize()); // 移除窗口，变化时重置图表
        this.setState({chart: null});
    }

    setOptions() {

        let {xAxisData, getNumData, putNumData, memoryCapacityData} = this.state;

        this.state.chart.setOption({
            backgroundColor: "#394056",
            title: {
                top: 20,
                text: "使用概况",
                textStyle: {
                    fontWeight: "normal",
                    fontSize: 16,
                    color: "#F1F1F3",
                },
                left: "1%",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    lineStyle: {
                        color: "#57617B",
                    },
                },
            },
            legend: {
                top: 20,
                icon: "rect",
                itemWidth: 14,
                itemHeight: 5,
                itemGap: 13,
                data: ["getNum", "putNum"],
                right: "4%",
                textStyle: {
                    fontSize: 12,
                    color: "#F1F1F3",
                },
            },
            grid: {
                top: 100,
                left: "2%",
                right: "2%",
                bottom: "2%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: {
                            color: "#57617B",
                        },
                    },
                    data: xAxisData,
                },
            ],
            yAxis: [
                {
                    type: "value",
                    name: "(%)",
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#57617B",
                        },
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: 14,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#57617B",
                        },
                    },
                },
            ],
            series: [
                {
                    name: "getNum",
                    type: "line",
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1,
                        },
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: "rgba(137, 189, 27, 0.3)",
                                    },
                                    {
                                        offset: 0.8,
                                        color: "rgba(137, 189, 27, 0)",
                                    },
                                ],
                                false
                            ),
                            shadowColor: "rgba(0, 0, 0, 0.1)",
                            shadowBlur: 10,
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: "rgb(137,189,27)",
                            borderColor: "rgba(137,189,2,0.27)",
                            borderWidth: 12,
                        },
                    },
                    data: getNumData,
                },
                {
                    name: "putNum",
                    type: "line",
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1,
                        },
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: "rgba(0, 136, 212, 0.3)",
                                    },
                                    {
                                        offset: 0.8,
                                        color: "rgba(0, 136, 212, 0)",
                                    },
                                ],
                                false
                            ),
                            shadowColor: "rgba(0, 0, 0, 0.1)",
                            shadowBlur: 10,
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: "rgb(0,136,212)",
                            borderColor: "rgba(0,136,212,0.2)",
                            borderWidth: 12,
                        },
                    },
                    data: putNumData,
                },
                // {
                //     name: "memoryCapacity",
                //     type: "line",
                //     smooth: true,
                //     symbol: "circle",
                //     symbolSize: 5,
                //     showSymbol: false,
                //     lineStyle: {
                //         normal: {
                //             width: 1,
                //         },
                //     },
                //     areaStyle: {
                //         normal: {
                //             color: new echarts.graphic.LinearGradient(
                //                 0,
                //                 0,
                //                 0,
                //                 1,
                //                 [
                //                     {
                //                         offset: 0,
                //                         color: "rgba(219, 50, 51, 0.3)",
                //                     },
                //                     {
                //                         offset: 0.8,
                //                         color: "rgba(219, 50, 51, 0)",
                //                     },
                //                 ],
                //                 false
                //             ),
                //             shadowColor: "rgba(0, 0, 0, 0.1)",
                //             shadowBlur: 10,
                //         },
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: "rgb(219,50,51)",
                //             borderColor: "rgba(219,50,51,0.2)",
                //             borderWidth: 12,
                //         },
                //     },
                //     data: memoryCapacityData,
                // },
            ],
        });
    }

    initChart() {
        if (!this.el) return;
        this.setState({chart: echarts.init(this.el, "macarons")}, () => {
            this.setOptions();
        });
    }

    handleGoPage = (url) => {
        let row = this.state.bucket;
        url = url + '?bucketId=' + row.bucketId + '&bucketName=' + row.bucketName + '&authority=' + row.authority;
        this.props.history.push(url)
    }

    // 开始时间选择器(监控记录日期变换)
    handleStartDateChange = (value, dateString) => {
        this.setState({
            startTime: dateString,
        });
    };

    // 结束时间选择器(监控记录日期变换)
    handleEndDateChange = (value, dateString) => {
        this.setState({
            endTime: dateString,
        });
    };

    // 结束时间可选范围
    handleEndDisabledDate = (current) => {
        const {startTime} = this.state;
        if (startTime !== '') {
            // 核心逻辑: 结束日期不能多余开始日期后60天，且不能早于开始日期
            return current > moment(startTime).add(30, 'day') || current < moment(startTime);
        } else {
            return null;
        }
    }

    // 开始时间可选范围
    handleStartDisabledDate = (current) => {
        const {endTime} = this.state;
        if (endTime !== '') {
            // 核心逻辑: 开始日期不能晚于结束日期，且不能早于结束日期前60天
            return current < moment(endTime).subtract(30, 'day') || current > moment(endTime);
        } else {
            return null;
        }
    }


    search = () => {
        const {bucket, startTime, endTime} = this.state;
        console.log(startTime, endTime);
        if (!startTime || !endTime) {
            message.error('请选择开始时间和结束时间！')
        }
        this.getStatisticsData(bucket, [startTime, endTime], () => {
            this.setOptions()
        });
    }

    render() {
        const {statistics} = this.state
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
        return (
            <div style={{width: "100%", height: "calc(100vh - 300px)"}} className="app-container">
                <br/>
                <Card title={title}>
                    <Form layout="inline">
                        <Row>
                            <Col span={11}>
                                <Form.Item label="时段">
                                    <Form.Item style={{marginTop: '3px'}}>
                                        <DatePicker
                                            onChange={this.handleStartDateChange.bind(this)}
                                            disabledDate={this.handleStartDisabledDate.bind(this)}
                                            placeholder="开始日期"
                                        />
                                    </Form.Item>

                                    <span style={{
                                        display: 'inline-block',
                                        textAlign: 'center'
                                    }}>-&nbsp;&nbsp;&nbsp;&nbsp;</span>

                                    <Form.Item style={{marginTop: '3px'}}>
                                        <DatePicker
                                            onChange={this.handleEndDateChange.bind(this)}
                                            disabledDate={this.handleEndDisabledDate.bind(this)}
                                            placeholder="结束日期"
                                        />
                                    </Form.Item>

                                    <Form.Item style={{marginTop: '3px'}}>
                                        <Button type='primary'
                                                onClick={this.search.bind(this)}>搜索</Button>
                                    </Form.Item>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>


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

                    {/*    <Table bordered rowKey="id" dataSource={statistics} pagination={false}>*/}
                    {/*        <Column title="编号" dataIndex="id" key="id" align="center"/>*/}
                    {/*        <Column title="空间名称" dataIndex="bucketName" key="bucketName" align="center"/>*/}
                    {/*        <Column title="空间容量" dataIndex="memoryCapacity" key="memoryCapacity" align="center"/>*/}
                    {/*        <Column title="获取次数" dataIndex="getNum" key="getNum" align="center"/>*/}
                    {/*        <Column title="上传次数" dataIndex="putNum" key="putNum" align="center"/>*/}
                    {/*        <Column title="年" dataIndex="year" key="year" align="center"/>*/}
                    {/*        <Column title="月" dataIndex="month" key="month" align="center"/>*/}
                    {/*        <Column title="日" dataIndex="day" key="day" align="center"/>*/}
                    {/*    </Table>*/}
                </Card>


                <div
                    style={{width: "100%", height: "90%"}}
                    ref={(el) => (this.el = el)}
                ></div>

            </div>
        );
    }
}

export default BucketDetail;
