import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { useMediaQuery } from "react-responsive";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  LoadingOutlined,
  UserOutlined,
  BarsOutlined,
  GroupOutlined,
  AuditOutlined,
  FundOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FolderOutlined,
  AudioOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button, Row, Col, Spin } from "antd";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AuthButton from "../components/AuthButton";

import LokaLogo from "../assets/image/loka_logo.png";

import "./style.css";

const { Header, Content, Sider } = Layout;

const LayoutContainers = () => {
  const navigate = useNavigate();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1080px)",
  });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout>
      {!isDesktopOrLaptop && !collapsed && (
        <Sider
          collapsible
          collapsed={collapsed}
          width={250}
          breakpoint="lg"
          collapsedWidth="0"
          trigger={null}
        >
          <>
            <div className="sider-logo-container">
              <img src={LokaLogo} alt="loka-logo" width="40%" />
            </div>
            <div className="sider-change-language-container">
              <LanguageSwitcher withText />
            </div>
            <div className="sider-connect-container">
              <AuthButton />
            </div>
          </>
        </Sider>
      )}
      <Layout>
        {/* <Header
            style={{
              display: "flex",
              alignItems: "center",
              padding: isDesktopOrLaptop ? "0 25px" : "0 10px",
            }}
          >
            <Row style={{ width: "100%" }}>
              {collapsed && (
                <>
                  <Col xs={{ span: 6 }} sm={{ span: 6 }}>
                    <div
                      className="header-logo-container"
                      style={{ justifyContent: "start" }}
                    >
                      <img
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                        src={LokaLogo}
                        alt="loka-logo"
                        width={!isDesktopOrLaptop && isPortrait ? "60%" : "35%"}
                      />
                    </div>
                  </Col>
                </>
              )}

              <Col xs={{ span: 12 }} sm={{ span: 12 }}>
                <div className="bitcoin-price-container"></div>
              </Col>

              <Col xs={{ span: !collapsed ? 24 : 6 }} sm={{ span: 6 }}>
                <div className="header-button-container">
                  {isDesktopOrLaptop ? (
                    <>
                      <LanguageSwitcher />
                      <AuthButton />
                    </>
                  ) : (
                    <Button
                      type="text"
                      className="toogle-collapse-button"
                      icon={
                        collapsed ? (
                          <MenuUnfoldOutlined />
                        ) : (
                          <MenuFoldOutlined />
                        )
                      }
                      onClick={() => setCollapsed(!collapsed)}
                      style={{
                        fontSize: "16px",
                        width: 64,
                        height: 64,
                        color: "white",
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Header>
                    */}
        <Content>
          <div>
            {((!isDesktopOrLaptop && collapsed) || isDesktopOrLaptop) && (
              <Outlet />
            )}
            {}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutContainers;
