/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useMemo } from "react";
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
import { clsx } from "clsx";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, theme, Button, Row, Col, Spin } from "antd";
import { useMediaQuery } from "react-responsive";
import { isIOS } from "react-device-detect";

import { normalizerouteData } from "../helper//normalize";
import { AppContext } from "../AppProvider";
import ProfileDropDown from "../components/ProfileDropDown";
import Notification from "../components/Notification";
import companyLogo from "../assets/company-logo.png";
import companyLogoIcon from "../assets/company-logo-icon.png";

import "./style.css";

const { Header, Content, Footer, Sider } = Layout;

const mappingIcon = {
  UserOutlined: <UserOutlined />,
  BarsOutlined: <BarsOutlined />,
  GroupOutlined: <GroupOutlined />,
  AuditOutlined: <AuditOutlined />,
  FundOutlined: <FundOutlined />,
  DollarOutlined: <DollarOutlined />,
  FolderOutlined: <FolderOutlined />,
  AudioOutlined: <AudioOutlined />,
  CloudUploadOutlined: <CloudUploadOutlined />,
  "List Of Values": <DatabaseOutlined />,
};

const DynamicLayout = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  // const isMobile = useMediaQuery({ query: "(max-width: 576px)" });
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const {
    session: { status, userId, role },
    coreAppData,
    handleLogOut,
  } = useContext(AppContext);
  const [collapsed, setCollapsed] = useState(true);
  const [showSiderMenu, setShowSiderMenu] = useState(false);
  const {
    token: { colorPellete1, colorPellete4, colorPellete5, colorSmall1 },
  } = theme.useToken();

  const location = useLocation();
  const currentParentPath = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const menuByRole = useMemo(() => {
    if (role) {
      const filteredParentPath = coreAppData.routePath.filter(
        (parentPath) => parentPath.path === currentParentPath
      );
      const filterMenuByRole = filteredParentPath[0].children.filter(
        (childPath) => childPath.eligibleRole.includes(role)
      );

      if (filteredParentPath[0].withSiderMenu) {
        setShowSiderMenu(true);
        setCollapsed(false);
      }

      if (isTabletOrMobile) {
        setCollapsed(true);
      }

      // return filterMenuByRole.map((menuItem) => ({
      //   key: menuItem.path,
      //   label: menuItem.label,
      //   icon: mappingIcon[menuItem.menuIcon],
      // }));

      const mappingRoute = normalizerouteData(filterMenuByRole, mappingIcon);
      return mappingRoute;
    }
    return [];
  }, [role]);

  const handleMenuClick = ({ key }) => {
    navigate(`${key}`, {
      replace: true,
      state: { from: location },
    });
    if (isTabletOrMobile && !collapsed) {
      setCollapsed(true);
    }
  };

  // redirect tp the first path in layout
  useEffect(() => {
    if (status === "authenticated" && userId && role) {
      navigate(menuByRole[0].key);
    }
    if (status === "waiting") {
      return <Spin indicator={antIcon} />;
    }

    if (status === "no-authenticated") {
      navigate("/");
    }
  }, [status]);

  return (
    status === "authenticated" &&
    userId &&
    role && (
      <Layout
        className={clsx("dynamic-layout-container", {
          "force-mobile-hieght": isIOS,
        })}
      >
        {(isTabletOrMobile || showSiderMenu) && (
          <Sider
            className="sider-menu-component"
            width={isTabletOrMobile ? 250 : 300}
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
            collapsible
            collapsed={collapsed}
            trigger={null}
          >
            <div
              className="app-name-header-container"
              style={{ height: "64px" }}
            >
              {/* <p style={{ color: "white" }} className="title">
              {coreAppData.shortName}
            </p> */}
              <img src={companyLogo} alt="logo" width={"50%"} />
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[
                location.pathname.split("/")[
                  location.pathname.split("/").length - 1
                ],
              ]}
              onClick={handleMenuClick}
              items={menuByRole}
              style={{ marginTop: "20px" }}
            />
            {isTabletOrMobile && !collapsed && (
              <div className="logout-button-contianer">
                <Button
                  size="medium"
                  icon={<LogoutOutlined rotate={180} />}
                  type="text"
                  style={{ color: colorPellete1 }}
                  onClick={() => handleLogOut()}
                >
                  Logout
                </Button>
              </div>
            )}
          </Sider>
        )}

        <Layout>
          <Header
            style={{
              padding: 0,
              ...(showSiderMenu && { backgroundColor: colorPellete5 }),
            }}
          >
            <Row justify={"end"}>
              {isTabletOrMobile && collapsed && (
                <Col xs={{ span: 16 }} md={{ span: 8 }}>
                  <div className="mobile-logo-container">
                    <img src={companyLogoIcon} alt="logo" width={"30%"} />
                  </div>
                  {/* <p
                  style={{
                    color: colorPellete1,
                    fontSize: "25px",
                    marginLeft: "20px",
                    fontWeight: "900",
                  }}
                  className="title"
                >
                  {"asdasd1"}
                </p> */}
                </Col>
              )}
              {isDesktopOrLaptop && !showSiderMenu && (
                <>
                  <Col span={4}>
                    <div className="app-name-header-container">
                      <p style={{ color: "white" }} className="title">
                        {"asdasd2"}
                      </p>
                    </div>
                  </Col>

                  <Col span={14}>
                    <Menu
                      theme="dark"
                      mode="horizontal"
                      selectedKeys={[
                        location.pathname.split("/")[
                          location.pathname.split("/").length - 1
                        ],
                      ]}
                      onClick={handleMenuClick}
                      items={menuByRole}
                    />
                  </Col>
                </>
              )}

              <Col xs={{ span: 8 }} md={{ span: 16 }}>
                {isTabletOrMobile ? (
                  <div
                    className="sider-trigger-container"
                    style={{
                      display: "flex",
                      // justifyContent: collapsed ? "end" : "start",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    {collapsed && <Notification />}

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
                        color: showSiderMenu ? colorPellete1 : "white",
                      }}
                    />
                  </div>
                ) : (
                  <div className="profile-notif-container">
                    <Notification />
                    <ProfileDropDown
                      color={showSiderMenu ? colorPellete1 : "white"}
                      showName={isTabletOrMobile ? false : true}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Header>
          <Content
            style={{ margin: "12px 16px 0", backgroundColor: colorPellete5 }}
          >
            <div
              style={{
                padding: "0px 12px 12px 12px",
                height: "100%",
              }}
            >
              {((isTabletOrMobile && collapsed) || isDesktopOrLaptop) && (
                <Outlet />
              )}
            </div>
          </Content>
          {((isTabletOrMobile && collapsed) || isDesktopOrLaptop) && (
            <Footer style={{ textAlign: "center", bottom: 0 }}>
              {`${coreAppData.appName}  ©${new Date().getFullYear()} `}
            </Footer>
          )}
        </Layout>
      </Layout>
    )
  );
};

export default DynamicLayout;
