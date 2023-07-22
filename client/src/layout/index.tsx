import React from "react";
import { Layout, Typography, Row, Col, Card, Space, Button } from "antd";
import { Link } from "react-router-dom";
import { clearLocalStorage, getProfileFromLS } from "../utils";
import { TUser } from "../@types/auth.type";

const layoutStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  color: "#000",
};

const contentStyle: React.CSSProperties = {
  paddingTop: "40px",
  paddingBottom: "40px",
  backgroundColor: "#fff",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { Title } = Typography;
  const { Header, Content, Footer } = Layout;
  const [profile, setProfile] = React.useState<{
    accessToken: string;
    user: TUser;
  } | null>(getProfileFromLS());
  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Row align="middle">
          <Col span={4}>
            <Link to="/">
              <Title style={{ margin: 0 }} level={3}>
                VIETNT
              </Title>
            </Link>
          </Col>
          <Col span={16}></Col>
          <Col span={4}>
            {profile?.user.role === "admin" && (
              <Link to="/admin">
                <Button type="link">Admin</Button>
              </Link>
            )}
            {!profile?.accessToken ? (
              <Space>
                <Link to="/signin">
                  <Button type="primary" ghost>
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button type="primary">Đăng kí</Button>
                </Link>
              </Space>
            ) : (
              <Button
                onClick={() => {
                  clearLocalStorage();
                  setProfile(null);
                }}
                type="primary"
              >
                Đăng xuất
              </Button>
            )}
          </Col>
        </Row>
      </Header>
      <Content style={contentStyle}>{children}</Content>
      <Footer>
        <Title level={5}>VIETNT</Title>
      </Footer>
    </Layout>
  );
}
