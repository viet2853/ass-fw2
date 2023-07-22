import React, { useState } from "react";
import { Button, Menu, MenuProps } from "antd";
import {
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem(<Link to="/admin">Dashboard</Link>, "1", <PieChartOutlined />),
  getItem(<Link to="/admin/products">Product</Link>, "2", <DesktopOutlined />),
  getItem(
    <Link to="/admin/categories">Category</Link>,
    "3",
    <ContainerOutlined />
  ),
  getItem(<Link to="/admin/user">User</Link>, "4", <ContainerOutlined />),
];
export default function SiderAdmin() {
  return (
    <div style={{ width: 256 }}>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        items={items}
      />
    </div>
  );
}
