import React, { useState } from "react";
import styles from "@/styles/containerThemes/home/v1.module.scss";
import {
  CompassOutlined,
  EditOutlined,
  SettingOutlined,
  RobotOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu } from "antd";
import type { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import ThemeToggle from "@/components/ui/themeToggle/themeToggle";
import Settings from "./pages/settings";
import Page1 from "./pages/page1";
import Page2 from "./pages/page2";
import Page0 from "./pages/page0";
import Page3 from "./pages/page3";
import mainLogo from "../../../assets/logo/autopilotLogoMain.png"
import { logout } from "@/redux/reducers/appSlice";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;
const items = [
  {
    key: "page1",
    icon: <EditOutlined />,
    label: "New Chat",
  },
  {
    key: "page2",
    icon: <CompassOutlined />,
    label: "Workspace",
  },
  // {
  //   key: "page3",
  //   icon: <RobotOutlined />,
  //   label: "Copilot",
  // },
  // {
  //   key: "page4",
  //   icon: <SettingOutlined />,
  //   label: "Settings",
  // },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState<any>({
    key: "page1",
    icon: <EditOutlined />,
    label: "New Chat",
  });
  const router = useRouter();

  const handleLogout = () => {
    // Clear user data from sessionStorage
    sessionStorage.removeItem("userProfile");

    // Dispatch the logout action
    dispatch(logout());

    // Redirect to the login page
    router.push("/login");
  };

  const theme = useSelector((state: RootState) => state.app.theme);
  const appInfo = useSelector((state: RootState) => state.app.appInfo);
  const userInfo = useSelector((state: RootState) => state.app.userInfo);
  const chat = useSelector((state: RootState) => state.chat);

  const dispatch = useDispatch();

  return (
    <Layout className={`${styles.homeContainer}  primaryText`} style={{ backgroundColor: '#FFDAB9' }} >
      <Sider
        theme={theme === "dark" ? "dark" : "light"}
        className={styles.siderContainer}
        style={{ backgroundColor: '#FFDAB9' }} 
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
      >
        <div className={styles.rootFlexCont}>
          <div>
            <div className={styles.logoContainer}>
              {appInfo && <img src={mainLogo.src} className={styles.logo} />}
            </div>

            <Menu
              theme={theme === "dark" ? "dark" : "light"}
              mode="inline"
              defaultSelectedKeys={[selectedMenu.key]}
              selectedKeys={[selectedMenu.key]}
              items={items}
              onSelect={(e) => {
                const [selectedItem] = items.filter(
                  (item) => item.key === e.key
                );
                setSelectedMenu(selectedItem || {});
              }}
            />
          </div>

          <div className={styles.footerContainer}>
            {/* <div className={styles.themeToggleContainer}>
              <span className={styles.text}>Theme</span>
              <ThemeToggle />
            </div> */}

            <div className={styles.flexContainer} style={{ backgroundColor: '#FFDAB9' }} >
              <span className={styles.userName}>{userInfo?.name}</span>
              <Button className={styles.logoutButton}  onClick={handleLogout}>
                <LogoutOutlined />
              </Button>
            </div>
          </div>
        </div>
      </Sider>
      <Layout className={`bg-primary primaryText ${styles.rightContainer}`}>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}

        <div style={{ width: "100%", height: "100%" }}>
          {selectedMenu.key === "page0" && <Page0 chat={chat} />}
          {selectedMenu.key === "page1" && (
            <Page1 chat={chat} setSelectedMenu={setSelectedMenu} />
          )}
          {selectedMenu.key === "page2" && (
            <Page2 userInfo={userInfo} setSelectedMenu={setSelectedMenu} />
          )}
          {selectedMenu.key === "page4" && <Settings userInfo={userInfo} />}
          {selectedMenu.key === "page3" && <Page3 userInfo={userInfo} />}
        </div>

        {/* <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Home;
