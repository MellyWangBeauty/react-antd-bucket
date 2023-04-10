import React, { Component } from "react";
import ReactDOM from "react-dom";
import echarts from "echarts";
class S2 extends Component {
  dom = React.createRef();
  componentDidMount() {
    const option = {
      // 居中标题
      title: {
        text: "标题",
        x: "center",
      },
      // 调色盘颜色列表
      color: ["#ffccee", "#006699", "#4cabce", "#e5323e"],
      // 直角坐标系内绘图网格
      grid: {
        // 显示网格border
        // show: true,
        // grid 组件离容器左侧的距离。
        left: 5,
        right: 0,
        top: 40,
        bottom: 35,
        // grid 区域是否包含坐标轴的刻度标签。
        containLabel: true,
      },
      dataset: {
        source: [
          ["type", "2012", "2013", "2014", "2015", "2016"],
          ["Forest", 320, 332, 301, 334, 390],
          ["Steppe", 220, 182, 191, 234, 290],
          ["Desert", 150, 232, 201, 154, 190],
          ["Wetland", 98, 77, 101, 99, 40],
        ],
      },
      xAxis: {
        type: "category",
        show: true,
        // x 轴的位置。
        position: "bottom",
        // X 轴相对于默认位置的偏移
        offset: 10,
        // 坐标轴名称。
        name: "x坐标轴名称",
        // 坐标轴名称显示位置。
        nameLocation: "end",
        // 是否显示坐标轴刻度。
        axisTick: {
          show: false,
        },
        axisLabel: {
          // 是否显示刻度标签。
          show: true,
          textStyle: {
            fontSize: 12,
            color: "#998877",
          },
        },
        axisLine: {
          // 是否显示坐标轴轴线
          show: true,
          lineStyle: {
            color: "#334455",
          },
        },
        // 指示器类型。鼠标放上去的效果，line 也常用
        axisPointer: {
          type: "shadow",
        },
        data: null,
      },
      yAxis: {
        type: "value",
        name: "单位：吨",
        /* 坐标轴名称显示位置。 */
        nameLocation: "end",
        nameTextStyle: {
          // 坐标轴名称的颜色，默认取 axisLine.lineStyle.color。
          color: "#999999",
          // [上, 右, 下, 左] 的边距
          padding: [0, 25, 3, 0],
          fontSize: 12,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          // 刻度标签旋转的角度，旋转的角度从 -90 度到 90 度。
          // rotate: -45,
          // 刻度标签与轴线之间的距离。
          margin: 8,
          // 刻度标签是否朝内，默认朝外。
          inside: false,
          textStyle: {
            fontSize: 12,
            color: "#ee6611",
          },
          // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
          formatter: "{value}%",
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          // 坐标轴在 grid 区域中的分隔线
          show: true,
          lineStyle: {
            color: "#3311cc",
          },
        },
      },
      legend: {
        show: true,
        // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。
        selectedMode: true,
        bottom: 0,
        type: "scroll",
        width: "80%",
        left: "center",
        textStyle: { color: "#4F5058" },
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 30,
        pageIconSize: 12,
        pageTextStyle: { color: "#4F5058" },
        pageIconColor: "#4F5058",
        pageIconInactiveColor: "#A4A4A4",
        data: null,
      },
      series: [
        {
          type: "bar",
          // 数据到图形的映射
          // 指定 dataset 的列（column）还是行（row）映射为图形系列（series）。默认是按照列（column）来映射。
          seriesLayoutBy: "column",
        },
        {
          type: "bar",
          seriesLayoutBy: "column",
        },
        {
          type: "bar",
          seriesLayoutBy: "column",
        },
        {
          type: "bar",
          seriesLayoutBy: "column",
          // 图形上的文本标签
          label: {
            show: true,
            position: "top",
            // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
            distance: 6,
            color: "rgba(41, 62, 181, 1)",
          },
        },
      ],
    };
    const myChart = echarts.init(this.dom.current);
    myChart.setOption(option);
  }
  render() {
    // 作为初始化的DOM，必须给宽高
    return <div ref={this.dom} style={{ width: 600, height: 400 }} />;
  }
}

export default S2;
