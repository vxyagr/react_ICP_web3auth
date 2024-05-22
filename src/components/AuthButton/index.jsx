import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon, {
  PoweroffOutlined,
  CloseOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

import { actorCreation } from "../../service/icdragoncanister";

import { Button, Modal, message } from "antd";
import { AppContext } from "../../context/AppProvider";

import "./style.css";

const IconConnect = () => (
  <svg
    width="20"
    height="10"
    viewBox="0 0 20 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.25 0.833375H5.83333C3.53214 0.833375 1.66666 2.69886 1.66666 5.00004C1.66666 7.30123 3.53214 9.16671 5.83333 9.16671H7.5C9.80118 9.16671 11.6667 7.30123 11.6667 5.00004M13.75 9.16671H14.1667C16.4679 9.16671 18.3333 7.30123 18.3333 5.00004C18.3333 2.69886 16.4679 0.833374 14.1667 0.833374H12.5C10.1988 0.833374 8.33333 2.69886 8.33333 5.00004"
      stroke="white"
      stroke-width="1.66667"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const AuthButton = () => {
  const { t } = useTranslation();
  const { loginInstance, setCanisterActor } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    if (!loading) {
      setShowModal(false);
    }
  };

  async function handleLogin() {
    setLoading(true);
    try {
      const { privKey } = await loginInstance.login({
        loginProvider: "google",
        redirectUrl: `${window.origin}`,
      });

      if (!privKey) {
        throw new Error("failed login");
      }

      const actor = actorCreation(privKey);
      setCanisterActor(actor);
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      setLoading(false);
      setShowModal(false);
      message.error("login failed");
    }
  }

  const handleLogout = async () => {
    setLoading(true);
    await loginInstance.logout();
    setCanisterActor();
    setLoading(false);
  };

  return (
    <>
      {loginInstance && loginInstance.privKey ? (
        <Button size="large" type="primary" onClick={() => handleLogout()}>
          {t("disconnectWallet")}
          <PoweroffOutlined />
        </Button>
      ) : (
        <Button size="large" type="primary" onClick={() => setShowModal(true)}>
          {t("connectWallet")}
          <Icon component={IconConnect} />
        </Button>
      )}

      <Modal
        centered
        destroyOnClose
        width={392}
        open={showModal}
        closeIcon={<CloseOutlined onClick={() => handleCloseModal()} />}
        footer={false}
        styles={{
          body: {},
          content: {
            borderRadius: "32px",
            padding: "1rem 2rem",
            minHeight: "250px",
          },
        }}
      >
        <div className="modal-header">
          <p className="title">Sign in</p>
          <p className="subtitle">Your Loka wallet with one click</p>
        </div>
        <div className="modal-content">
          <Button
            type="primary"
            shape="round"
            className="modal-button"
            size="large"
            block
            icon={<GoogleOutlined />}
            loading={loading}
            onClick={() => handleLogin()}
          >
            Continue with Google
          </Button>
          <p className="modal-info">
            We do not store any data related to your social logins.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default AuthButton;
