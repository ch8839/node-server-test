import { Link, NavLink, Outlet } from "react-router-dom";
import { BulbOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Layout, Space, Switch, Typography } from "antd";
import { useAppTheme } from "@/theme/theme";
import styles from "./MainLayout.module.scss";

const { Header, Content } = Layout;
const { Title } = Typography;

function MainLayout() {
  const { mode, toggleTheme } = useAppTheme();
  const isDark = mode === "dark";

  return (
    <Layout className={styles.appShell}>
      <Header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link to="/" className={styles.brand}>
            <Title level={4} className={styles.brandTitle}>
              Material Library
            </Title>
          </Link>
          <Space size={20}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.topLink} ${isActive ? styles.topLinkActive : ""}`
              }
            >
              首页
            </NavLink>
            <a className={styles.topLink} href="https://ant.design" target="_blank" rel="noreferrer">
              Ant Design
            </a>
            <Space size={8} className={styles.themeSwitchWrap}>
              <BulbOutlined />
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
            </Space>
          </Space>
        </div>
      </Header>
      <Content className={styles.pageContent}>
        <div className={styles.pageContainer}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}

export default MainLayout;
