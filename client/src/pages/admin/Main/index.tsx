import { Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../../api/product.api";
import { getCategories } from "../../../api/category.api";
import { getUsers } from "../../../api/user.api";
import { TResListProductData } from "../../../@types/product.type";
import { TCategory } from "../../../@types/category.type";
import { TUser } from "../../../@types/auth.type";
import {
  ContainerOutlined,
  DesktopOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

export default function MainAdmin() {
  const [total, setTotal] = useState<{
    products?: number;
    categories?: number;
    users?: number;
  }>({
    products: 0,
    categories: 0,
    users: 0,
  });
  const { Title } = Typography;
  useEffect(() => {
    Promise.all([getProducts, getCategories, getUsers])
      .then((res) => Promise.all(res.map((fn) => fn({}))))
      .then((res) => res.map((r) => r.data))
      .then((res) => {
        const [products, categories, users] = res;
        setTotal((prev) => ({
          ...prev,
          products: products.total,
          categories: categories.total,
          users: users.total,
        }));
      });
  }, []);
  return (
    <Row gutter={24}>
      <Col span={8}>
        <Card title="Products" extra={<Link to="/admin/products">More</Link>}>
          <Title level={2}>
            {total.products}
            <DesktopOutlined style={{ marginLeft: 12 }} />
          </Title>
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title="Categories"
          extra={<Link to="/admin/categories">More</Link>}
        >
          <Title level={2}>
            {total.categories}
            <ContainerOutlined style={{ marginLeft: 12 }} />
          </Title>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Users" extra={<Link to="/admin/users">More</Link>}>
          <Title level={2}>
            {total.users}
            <UserAddOutlined style={{ marginLeft: 12 }} />
          </Title>
        </Card>
      </Col>
    </Row>
  );
}
