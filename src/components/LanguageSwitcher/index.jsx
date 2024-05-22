import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Button, Dropdown, Space } from "antd";
import { useMediaQuery } from "react-responsive";

import En from "../../assets/icon/us.svg";
import Id from "../../assets/icon/id.svg";

import "./style.css";

const EnFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="flag-icons-us"
    viewBox="0 0 640 480"
  >
    <path fill="#bd3d44" d="M0 0h640v480H0" />
    <path
      stroke="#fff"
      stroke-width="37"
      d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
    />
    <path fill="#192f5d" d="M0 0h364.8v258.5H0" />
    <marker id="us-a" markerHeight="30" markerWidth="30">
      <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z" />
    </marker>
    <path
      fill="none"
      marker-mid="url(#us-a)"
      d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z"
    />
  </svg>
);

const IdFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="flag-icons-id"
    viewBox="0 0 640 480"
  >
    <path fill="#e70011" d="M0 0h640v240H0Z" />
    <path fill="#fff" d="M0 240h640v240H0Z" />
  </svg>
);

const mappingLanguage = {
  id: {
    icon: IdFlag,
    code: "id",
  },
  en: {
    icon: EnFlag,
    code: "en",
  },
};

const LanguageSwitcher = ({ withText = false }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1080px)",
  });
  const { i18n, t } = useTranslation();
  const [selectedKey, setSelectedKey] = useState(i18n.language);
  const handleMenuClick = ({ key }) => {
    i18n.changeLanguage(key);
    setSelectedKey(mappingLanguage[key].code);
  };
  const items = [
    {
      key: "en",
      label: withText ? t("english") : "",
      icon: <img src={En} width={24} alt="en-flag" />,
    },
    {
      key: "id",
      label: withText ? t("indonesia") : "",
      icon: <img src={Id} width={24} alt="id-flag" />,
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
    style: { backgroundColor: withText ? "#F3F3F3" : "transparent" },
  };
  return (
    <Dropdown
      className="language-switcher-dropdown"
      menu={menuProps}
      trigger="click"
    >
      <Button>
        <Space>
          <img
            src={selectedKey === "en" ? En : Id}
            width={isDesktopOrLaptop ? 24 : 18}
            alt="language-switcher"
          />

          {withText && (
            <span className="change-language-text">{t("changeLanguage")}</span>
          )}

          <DownOutlined style={{ color: "white" }} />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
