import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Typography,
  notification,
} from "antd";
import React from "react";
import { login } from "../../api/auth.api";
import { TResError } from "../../@types/common.type";
import { useNavigate } from "react-router-dom";
import { setProfileToLS } from "../../utils";

export const authContainer: React.CSSProperties = {
  width: "400px",
  margin: "100px auto",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
};

export default function Login() {
  const { Title } = Typography;
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const { name, email, password } = values;
    try {
      const { data } = await login({ email, password });
      if (!data.data) return;
      setProfileToLS(data.data);
      navigate("/");
    } catch (error) {
      notification.error({
        message: (error as TResError).message,
      });
    }
  };

  return (
    <Row gutter={24} style={authContainer}>
      <Col span={24}>
        <Title level={3}>Đăng nhập</Title>
      </Col>
      <Col span={24}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 24 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" style={{ width: "100%" }} htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
