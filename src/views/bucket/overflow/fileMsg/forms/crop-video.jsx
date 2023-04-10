import React, {Component} from "react";
import "@/styles/crop-video.less";
import {arrayBufferToBase64, dateStrChangeTimeTamp, getNowTime} from "@/utils";
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
import {Modal, message, Spin} from "antd";


const ffmpeg = createFFmpeg({
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'
})
if (!ffmpeg.isLoaded()) {
    ffmpeg.load().then(() => {
        console.log(ffmpeg.isLoaded())
    }).catch(err => {
        console.log(err);
    });
}

class CropVideo extends Component {

    shaft = React.createRef();
    start = React.createRef();
    end = React.createRef();

    state = {
        shaftWidth: 0,
        data: {
            endLeft: 0, // 结束按钮距离左侧距离
            endRight: 0, // 结束按钮初始位置
            startLeft: 0, // 开始按钮距离左侧距离
            roal: 0, // 毫秒/px(1px===的毫秒数)
            startTime: "00:00:00.0", // 开始时间
            endTime: "00:00:00.0", // 结束时间
            timeList: [] // 时间轴显示时间数组
        },
        videoFrames: [],
        videoUrl: "",
        loading: true,
    };

    onplay = () => {
        let myVideo = document.getElementById("videoPlayer"),
            {startTime, endTime} = this.state.data;
        // 开始秒数
        let startM =
            (dateStrChangeTimeTamp(
                    "1970-01-02 " +
                    (startTime ? startTime : this.props.spliterStartTime)
                ) -
                1000 * 60 * 60 * 16) /
            1000;
        // 结束秒数
        let endM =
            (dateStrChangeTimeTamp(
                    "1970-01-02 " +
                    (endTime ? endTime : this.props.spliterEndTime)
                ) -
                1000 * 60 * 60 * 16) /
            1000;
        // 如果当前秒数小于等于截取的开始时间,就按截取的开始时间播放,如果不是,则为继续播放
        if (myVideo.currentTime <= startM || myVideo.currentTime > endM) {
            myVideo.currentTime = startM;
            myVideo.play();
        }
    };

    //设置播放点
    playBySeconds = (num) => {
        if (num && document.getElementById("videoPlayer")) {
            let myVideo = document.getElementById("videoPlayer");
            myVideo.currentTime = num;
        }
    };

    // 起始按钮
    startMouseDown = (e) => {
        let odiv = e.currentTarget; //获取目标父元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        document.onmousemove = e => {
            let {clientWidth, offsetLeft} = this.start.current;
            const {data} = this.state;
            //鼠标按下并移动的事件
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;

            //移动当前元素
            odiv.style.left = left + "px";
            //获取距离窗口宽度
            let mas = odiv.offsetLeft;
            if (mas <= -(clientWidth / 2)) {
                odiv.style.left = -(clientWidth / 2) + "px";
            } else if (
                mas >=
                data.endLeft - Math.ceil(1000 / data.roal)
            ) {
                odiv.style.left =
                    data.endLeft - Math.ceil(1000 / data.roal) + "px";
            }
            data.startTime = getNowTime(
                data.roal * Math.floor(offsetLeft + clientWidth / 2)
            );
            data.startLeft = clientWidth + offsetLeft;

            this.setState({
                data: data
            })

            // 开始秒数
            let startM =
                (dateStrChangeTimeTamp(
                        "1970-01-02 " +
                        (data.startTime
                            ? data.startTime
                            : this.spliterStartTime)
                    ) -
                    1000 * 60 * 60 * 16) /
                1000;
            this.playBySeconds(startM);
        };
        document.onmouseup = e => {
            document.onmousemove = null;
            document.onmouseup = null;
            this.handleTime();
        };
    };

    // 结束按钮
    endMouseDown = (e) => {
        let odiv = e.currentTarget; //获取目标父元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        document.onmousemove = e => {
            //鼠标按下并移动的事件
            let {clientWidth, offsetLeft} = this.end.current;
            const {data} = this.state;
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;
            //移动当前元素
            odiv.style.left = left + "px";
            //获取距离窗口宽度
            let mas = odiv.offsetLeft;

            if (
                mas <=
                data.startLeft - clientWidth + Math.ceil(1000 / data.roal)
            ) {
                odiv.style.left =
                    data.startLeft -
                    clientWidth +
                    Math.ceil(1000 / data.roal) +
                    "px";
                // console.log(22222)
            } else if (mas >= data.endright) {
                odiv.style.left = data.endright + "px";
                // console.log(33333)
            }
            data.endTime = getNowTime(
                data.roal * Math.floor(offsetLeft + clientWidth / 2)
            );
            data.endLeft = offsetLeft;

            this.setState({
                data: data
            })
        };
        document.onmouseup = e => {
            document.onmousemove = null;
            document.onmouseup = null;
            this.handleTime();
        };
    };

    // 传出起止时间的回调
    handleTime = () => {
        const {data} = this.state;
        let arr = [data.startTime, data.endTime];
        console.log(arr);
    };

    onSureCut = () => {
        const {data} = this.state;
        let arr = [data.startTime, data.endTime];
        console.log(arr);
        return arr;
    };

    onCancel = () => {
        return null;
    };

    // 获取视频播放时长
    getVideoTime = () => {
        let {data} = this.state;
        let videoPlayer = document.getElementById("videoPlayer");
        if (videoPlayer) {
            videoPlayer.addEventListener(
                "timeupdate",
                () => {
                    // 结束秒数
                    let endM =
                        (dateStrChangeTimeTamp(
                                "1970-01-02 " +
                                (data.endTime ? data.endTime : this.props.spliterEndTime)
                            ) -
                            1000 * 60 * 60 * 16) /
                        1000;
                    // 如果当前播放时间大于等于截取的结束秒数,就暂停
                    if (videoPlayer.currentTime >= endM) {
                        videoPlayer.pause();
                    }
                },
                false
            );
        }
    };

    // 上传视频后解析视频帧
    getVideoFrames = async (callback) => {
        try {
            let {videoFrames} = this.state;
            let {name, file, duration} = this.props.ffVideo;
            console.log(name, file, duration);
            ffmpeg.FS("writeFile", name, await fetchFile(file));
            // 计算每秒需要抽的帧数
            let step = Math.ceil(20 / duration),
                allNum = Math.floor(step * duration);
            console.log("step", step, allNum);
            await ffmpeg.run(
                "-i",
                name,
                "-r",
                `${step}`,
                "-ss",
                "0",
                "-vframes",
                `${allNum}`,
                "-f",
                "image2",
                "-s",
                "88*50",
                "image-%02d.png"
            );
            // ffmpeg -i 2.mp4 -r 1  -ss 0 -vframes 5 -f image2 -s 352x240 image-%02d.jpeg
            for (let i = 0; i < allNum; i++) {
                // await ffmpeg.run('-i', 'source.mp4', '-y', '-f', '-ss', averageDura * i, '1', 'frame.png')
                let temp = i + 1;
                if (temp < 10) {
                    temp = "0" + temp;
                }
                videoFrames.push(
                    arrayBufferToBase64(ffmpeg.FS("readFile", "image-" + temp + ".png"))
                );
            }
            console.log(videoFrames);
            callback(videoFrames);
        } catch (err) {
        }
    };

    componentDidMount() {
        console.log(this.shaft.current);

        // message.loading('Action in progress..', 2.5)

        let {data, roal, videoFrames} = this.state;
        const {startTime, endTime, spliterStartTime, spliterEndTime, videoUrl, ffVideo} = this.props;

        let str = "1970-01-02 ";
        let time = dateStrChangeTimeTamp(str + endTime) - dateStrChangeTimeTamp(str + startTime);
        roal = time / this.shaft.current?.clientWidth;
        let shaftWidth = this.shaft.current?.clientWidth;
        // 结束毫秒数
        let endM =
            dateStrChangeTimeTamp("1970-01-02 " + spliterEndTime) -
            1000 * 60 * 60 * 16;
        // 开始毫秒数
        let startM =
            dateStrChangeTimeTamp("1970-01-02 " + spliterStartTime) -
            1000 * 60 * 60 * 16;

        // 设置开始结束位置
        this.start.current.style.left = startM / roal - this.end.current.clientWidth / 2 + "px";
        this.end.current.style.left = endM / roal - this.end.current.clientWidth / 2 + "px";

        data.endLeft = this.end.current.offsetLeft;
        data.endright =
            this.shaft.current.clientWidth - this.end.current.clientWidth / 2;
        data.startLeft =
            this.start.current.offsetLeft + this.start.current.clientWidth / 2;

        this.getVideoTime();

        data.timeList.push(startTime);
        let paragraph =
            (dateStrChangeTimeTamp(str + endTime) - 1000 * 60 * 60 * 16) / 5;
        for (let i = 1; i < 6; i++) {
            data.timeList.push(getNowTime(paragraph * i));
            console.log('paragraph', data.timeList)
        }

        data.roal = roal;

        Object.assign(data, {
            endTime: endTime,
            startTime: startTime
        });


        if (ffVideo.frames.length) {
            videoFrames = ffVideo.frames;
            this.setState({
                data: data,
                shaftWidth: shaftWidth,
                videoFrames: videoFrames,
                videoUrl: videoUrl,
                loading: false,
            })
        } else {
            this.getVideoFrames((videoFrames) => {
                this.setState({
                    data: data,
                    shaftWidth: shaftWidth,
                    videoFrames: videoFrames,
                    videoUrl: videoUrl,
                    loading: false,
                })
            });
        }
    }


    render() {
        const {data, videoFrames, videoUrl, loading} = this.state;
        const shaft = this.shaft;

        let timeArr = [];
        data.timeList.forEach((item, index) => {
            timeArr.push(<li key={index}>{item}</li>)
        })

        let imgArr = [];

        videoFrames.forEach((i, n) => {
            imgArr.push(<img draggable={true} className="frames" style={{width: `calc(100% / ${videoFrames.length})`}}
                             key={n}
                             src={`data:image/jpg;base64,${i}`} alt=""/>)
        })

        return (
            <Spin spinning={loading}>
                <div className="cut-video">
                    <video id="videoPlayer" controls={true} preload="auto" muted={true} className="video" width="100%"
                           onPlay={this.onplay.bind(this)} src={videoUrl}/>
                    <ul className="time-list">
                        {timeArr}
                    </ul>
                    <div className="crop-filter">
                        <div className="timer-shaft" ref={this.shaft}>
                            <div className="white-shade" style={{
                                width: (data.endLeft - data.startLeft + 12) + 'px',
                                left: data.startLeft - 6 + 'px'
                            }}/>
                            <div className="left-shade" style={{width: (data.startLeft - 6) + 'px'}}/>
                            <div className="right-shade"
                                 style={{width: (shaft.current?.clientWidth - data.endLeft - 6) + 'px'}}/>

                            <div className="strat-circle circle" ref={this.start}
                                 onMouseDown={this.startMouseDown.bind(this)}>
                                <div className="center"/>
                            </div>


                            <div className="end-circle circle" ref={this.end}
                                 onMouseDown={this.endMouseDown.bind(this)}>
                                <div className="center"/>
                            </div>

                            {imgArr}
                        </div>
                    </div>
                </div>
            </Spin>
        )
    }
}

export default CropVideo;
