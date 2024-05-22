import React from "react";
import { Modal } from "antd";
import { ColorRing } from "react-loader-spinner";

import "./style.css";

const LoadingModal = () => {
  return (
    <Modal
      open
      zIndex={9999}
      closable={false}
      centered
      footer={null}
      transitionName={"fade"}
      maskTransitionName={"fade"}
      styles={{
        body: {
          width: "0px",
          padding: "0px",
        },
        content: {
          width: "0px",
          backgroundColor: "transparent",
          padding: "0px",
        },
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.55)",
        },
      }}
      className="modal-loading"
    >
      <ColorRing
        visible={true}
        height="150"
        width="150"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={["#79D5C6", "#FFFB09", "#2D6013", "#79D5C6", "#FFFB09"]}
      />
    </Modal>
  );
};

export default LoadingModal;
