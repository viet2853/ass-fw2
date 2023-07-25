import { Typography, Row, Col, Card, Empty, List, Button, Input } from "antd";
import { useState, useEffect } from "react";
import {
  EOrderBy,
  ESortBy,
  TProduct,
  TQueryParamsProduct,
} from "../../@types/product.type";
import { getProducts } from "../../api/product.api";
import { Link } from "react-router-dom";
import { TCategory } from "../../@types/category.type";
import { getCategories } from "../../api/category.api";

const cardImgStyle: React.CSSProperties = {
  height: "300px",
  objectFit: "cover",
  width: "100%",
};
export const baseQueryParams: TQueryParamsProduct = {
  page: 1,
  limit: 0,
  orderBy: EOrderBy.DESC,
  sortBy: ESortBy.CREATED_AT,
  categoryId: "",
  s: "",
};

export default function Home() {
  const { Meta } = Card;
  const [products, setProducts] = useState<TProduct[] | undefined>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [params, setParams] = useState<TQueryParamsProduct>(baseQueryParams);
  useEffect(() => {
    const fetchAllCategories = async () => {
      const { data } = await getCategories();
      setCategories(data.data as TCategory[]);
    };
    fetchAllCategories();
  }, []);
  useEffect(() => {
    const fetchAllProduct = async () => {
      const { data } = await getProducts(params);
      setProducts(data.data);
    };
    fetchAllProduct();
  }, [params]);
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row justify="end">
          <Col>
            <Input.Search
              onSearch={(value) => {
                setParams((prev) => ({ ...prev, s: value }));
              }}
              name="search"
              placeholder="Search"
              allowClear
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={24}>
          <Col span={4}>
            <List
              header={<Typography.Title level={4}>CATEGORIES</Typography.Title>}
              bordered
              dataSource={categories}
              renderItem={(item) => (
                <List.Item>
                  <Button
                    type="link"
                    onClick={() =>
                      setParams((prev) => ({ ...prev, categoryId: item._id }))
                    }
                  >
                    <Typography.Text
                      style={{
                        color: `${
                          params.categoryId === item._id ? "blue" : ""
                        }`,
                      }}
                    >
                      {item.name}
                    </Typography.Text>
                  </Button>
                </List.Item>
              )}
            />
          </Col>
          <Col span={20}>
            <Row gutter={[24, 24]}>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <Col span={6} key={product._id}>
                    <Link to={`/products/${product._id}`}>
                      <Card
                        hoverable
                        cover={
                          <img
                            style={cardImgStyle}
                            alt={product.name}
                            src={product.images[0]}
                          />
                        }
                      >
                        <Meta
                          title={product.name}
                          description={product.price}
                        />
                      </Card>
                    </Link>
                  </Col>
                ))
              ) : (
                <Row justify="center" style={{ width: "100%" }}>
                  <Empty />
                </Row>
              )}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
