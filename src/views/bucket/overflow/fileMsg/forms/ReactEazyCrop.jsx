import React from "react";
import { Modal, Form } from "antd";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

const ReactEazyCrop = ({ visible, onCancel, imgURL, onOk }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
  }, []);

  return (
    <Modal title="编辑图片" visible={visible} onCancel={onCancel} onOk={onOk}>
      <Cropper
        image={imgURL}
        crop={crop}
        zoom={zoom}
        aspect={4 / 3}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </Modal>
  );
};

export default Form.create({ name: "ReactEazyCrop" })(ReactEazyCrop);
