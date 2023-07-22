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
import { authContainer } from "../Login";
import { register } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { TResError } from "../../@types/common.type";

export default function Register() {
  const { Title } = Typography;
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const { name, email, password, confirmPassword } = values;
    try {
      await register({ name, email, password, confirmPassword });
      navigate("/signin");
    } catch (error) {
      notification.error({
        message: (error as TResError).message,
      });
    }
  };

  return (
    <Row gutter={24} style={authContainer}>
      <Col span={24}>
        <Title level={3}>Đăng kí</Title>
      </Col>
      <Col span={24}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
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
            label="Confirm password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your confirm password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Retype your password" />
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
