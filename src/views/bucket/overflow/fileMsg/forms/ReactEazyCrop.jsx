import React from "react";
import { Modal, Form } from "antd";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

const ReactEazyCrop = ({ visible, onCancel, imgURL, onOk }) => {
  // const [crop, setCrop] = useState({ x: 2, y: 2 });
  // const [zoom, setZoom] = useState(1);
  // const [croppedArea, setCroppedArea] = useState("");

  // const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
  //   setCroppedArea(croppedAreaPixels);
  // }, []);

  // const showCroppedImage = useCallback(async () => {
  //   try {
  //     const croppedImage = await getCroppedImg(imgURL, croppedArea, 0);
  //     return croppedImage;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [croppedArea, imgURL]);

  return (
    <Modal title="编辑图片" visible={visible} onCancel={onCancel} onOk={onOk}>
      <div className="relative w-full">
        success!
        {/* <Cropper
          image={imgURL}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={() => {}}
          onCropComplete={() => {}}
          onZoomChange={() => {}}
        /> */}
      </div>
    </Modal>
  );
};

export default Form.create({ name: "ReactEazyCrop" })(ReactEazyCrop);
