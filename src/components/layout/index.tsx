"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DesktopOutlined,
  ContainerOutlined,
  PieChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import "@/styles/AppLayout.css"; // Import the CSS file for custom styles

const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "/", icon: <PieChartOutlined />, label: "Dashboard" },
  { key: "/resources", icon: <PieChartOutlined />, label: "Resource" },
  { key: "/projects", icon: <DesktopOutlined />, label: "Project" },
  { key: "/processes", icon: <ContainerOutlined />, label: "Process" },
  { key: "/tasks", icon: <ContainerOutlined />, label: "Task" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  activeMenuKey?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, activeMenuKey }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (key: string) => {
    router.push(key);
  };

  return (
<Layout style={{ minHeight: "100vh", width: '100%' }}>
  <Sider
    className="custom-sider"
    width={collapsed ? 80 : 170}
    collapsible
    collapsed={collapsed}
    onCollapse={toggleCollapsed}
    theme="light"
    style={{
      overflow: "auto",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
    }}
  >
    <Menu
      mode="inline"
      selectedKeys={[activeMenuKey || "/"]}
      items={items}
      onClick={(e) => handleMenuClick(e.key)}
      className="custom-menu"
    />
    <Button
      type="primary"
      onClick={toggleCollapsed}
      style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#fff",
        color: "#000",
      }}
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    />
  </Sider>
  <Layout style={{ marginLeft: collapsed ? 80 : 170 }}>
    <Content
      style={{
        padding: "24px",
        backgroundColor: "#fff",
        minHeight: "100%",
      }}
    >
      {children}
    </Content>
  </Layout>
</Layout>

  );
};

export default AppLayout;
