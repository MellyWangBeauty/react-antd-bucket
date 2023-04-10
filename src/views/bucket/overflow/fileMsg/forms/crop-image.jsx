import {Button, message} from 'antd';
import React, {useState, useEffect, useCallback, forwardRef, useImperativeHandle} from 'react';
import Cropper from 'react-easy-crop';
import type {Area} from 'react-easy-crop/types';

const PREFIX = 'tds';


const CropShowImg = forwardRef((props, ref) => {
    // @ts-ignore
    const {className = 'cropImage', imageUrl, ...otherProps} = props;
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [resultUrl, setResultUrl] = useState('');
    const [resultBlob, setResultBlob] = useState(new Blob());
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({x: 0, y: 0, width: 0, height: 0});

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        console.log(croppedArea, croppedAreaPixels);
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    //用useImperativeHandle暴露一些外部ref能访问的属性
    useImperativeHandle(ref, () => {
        return {
            func: getBlob,
        };
    });

    useEffect(() => {
        const imgSource = document.querySelector(`.${PREFIX}-media`);
        imgSource.setAttribute('crossOrigin', 'Anonymous'); // 处理跨域
        imgSource.onload = () => {
            // 加载图像完成之后
            console.log('图片已添加允许跨域的属性');
        };
    }, []);

    const onOk = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const {width: cropWidth, height: cropHeight, x: cropX, y: cropY} = croppedAreaPixels;
        const imgSource = document.querySelector(`.${PREFIX}-media`);
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        // ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, cropWidth, cropHeight);
        ctx.drawImage(imgSource, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        try {
            canvas.toBlob((blob) => {
                if (blob) {
                    console.log('blob', blob);
                    setResultBlob(blob);
                    const blobUrl = window.URL.createObjectURL(blob);
                    console.log('blobUrl', blobUrl);
                    setResultUrl(blobUrl);
                }
            });
        } catch (error) {
            message.error('无法导出受污染的画布');
            console.log('无法导出受污染的画布', error);
        }
    };

    /**
     * 获取裁剪后的blob对象
     * @returns {module:buffer.Blob}
     */
    function getBlob() {
        return resultUrl !== '' ? resultBlob : null;
    }

    return (
        <div className={`${className}`} {...otherProps} ref={ref}>
            <h2>Crop 操作区</h2>
            <div className="cropBox">
                <Cropper
                    image={imageUrl}
                    showGrid={true}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    classes={{
                        containerClassName: `${PREFIX}-container`,
                        mediaClassName: `${PREFIX}-media`,
                    }}
                />
            </div>
            <div style={{marginTop: 12, marginBottom: 12}}>
                <Button onClick={onOk}>生成剪切结果</Button>
            </div>
            <h2>剪切结果</h2>
            <img className='resultImg' src={resultUrl}/>
        </div>
    );
});

export default CropShowImg;
