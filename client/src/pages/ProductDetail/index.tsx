import { Card, Col, Divider, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, getProducts } from "../../api/product.api";
import { TProduct } from "../../@types/product.type";

export default function ProductDetail() {
  const { Title, Text } = Typography;
  const { id } = useParams();
  const [product, setProduct] = React.useState<TProduct>({} as TProduct);
  const [similarProducts, setSimilarProducts] = React.useState<TProduct[]>([]);
  const { Meta } = Card;

  useEffect(() => {
    (async () => {
      if (id) {
        const { data } = await getProduct(id);
        setProduct(data.data as TProduct);
        const { data: dataProductsSimilar } = await getProducts({
          _categoryId: data.data?.categoryId,
        });
        setSimilarProducts(
          (dataProductsSimilar.data?.docs as TProduct[]).filter(
            (p) => p._id !== id
          )
        );
      }
    })();
  }, [id]);
  return (
    <>
      <Row gutter={12}>
        {product && (
          <>
            <Col span={12}>
              <img width="100%" src={product.image} />
            </Col>
            <Col span={12}>
              <Title level={3}>{product.name}</Title>
              <Title level={4}>Giá: {product.price}</Title>
              <Divider>
                <Text style={{ margin: 0 }}>MÔ TẢ SẢN PHẨM</Text>
              </Divider>
              <Text>{product.description}</Text>
            </Col>
          </>
        )}
      </Row>
      <Divider orientation="left">
        <Title style={{ margin: 0 }} level={4}>
          SẢN PHẨM TƯƠNG TỰ
        </Title>
      </Divider>
      <Row gutter={[24, 24]}>
        {similarProducts && similarProducts.length > 0 ? (
          similarProducts.map((product) => (
            <Col span={8}>
              <Link to={`/products/${product._id}`}>
                <Card
                  hoverable
                  cover={
                    <img
                      height={300}
                      style={{ objectFit: "cover" }}
                      alt={product.name}
                      src={product.image}
                    />
                  }
                >
                  <Meta title={product.name} description={product.price} />
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <Text>Không có sản phẩm tương tự</Text>
        )}
      </Row>
    </>
  );
}
