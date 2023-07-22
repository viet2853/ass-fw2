import { Layout, Typography, Row, Col, Card, Empty } from "antd";
import { useState, useEffect } from "react";
import { TProduct } from "../../@types/product.type";
import { getProducts } from "../../api/product.api";
import { Link } from "react-router-dom";

const cardImgStyle: React.CSSProperties = {
  height: "300px",
  objectFit: "cover",
  width: "100%",
};

export default function Home() {
  const { Title } = Typography;
  const { Meta } = Card;
  const [products, setProducts] = useState<TProduct[] | undefined>([]);

  useEffect(() => {
    const fetchAllProduct = async () => {
      const { data } = await getProducts({});
      setProducts(data.data);
    };
    fetchAllProduct();
  }, []);
  return (
    <Row gutter={[24, 24]}>
      {products && products.length > 0 ? (
        products.map((product) => (
          <Col span={8} key={product._id}>
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
                <Meta title={product.name} description={product.price} />
              </Card>
            </Link>
          </Col>
        ))
      ) : (
        <Row justify="center">
          <Empty />
        </Row>
      )}
    </Row>
  );
}
