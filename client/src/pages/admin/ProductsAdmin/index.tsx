import {
  Avatar,
  Button,
  Carousel,
  Col,
  Empty,
  Image,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  notification,
} from "antd";
import React, { useEffect } from "react";
import { deleteProduct, getProducts } from "../../../api/product.api";
import {
  EOrderBy,
  ESortBy,
  TProduct,
  TQueryParamsProduct,
} from "../../../@types/product.type";
import { ColumnsType } from "antd/es/table";
import { TResError } from "../../../@types/common.type";
import CEModal from "./components/CEModal";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "./products.service";

const baseQueryParams = {
  page: 1,
  limit: 4,
  orderBy: EOrderBy.DESC,
  sortBy: ESortBy.CREATED_AT,
};

export default function ProductsAdmin() {
  const [params, setParams] =
    React.useState<TQueryParamsProduct>(baseQueryParams);
  const [isOpenCEModal, setIsOpenCEModal] = React.useState(false);
  const [productEdit, setProductEdit] = React.useState<TProduct | null>(null);

  const { data } = useGetProductsQuery(params);
  const listProduct = data?.data;
  const total = data?.total;

  const [mutate] = useDeleteProductMutation();
  const handleDelete = async (id: string) => {
    await mutate(id);
    notification.success({ message: "Delete Product Sucess" });
  };

  const columns: ColumnsType<TProduct> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      sorter: true,
      filterSearch: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
    },
    {
      title: "Galley",
      key: "images",
      render(_: any, record: TProduct) {
        return record?.images?.length > 0 ? (
          <Avatar.Group maxCount={3}>
            {record.images?.map((url) => (
              <div style={{ borderRadius: "50%", overflow: "hidden" }}>
                <Image
                  src={url}
                  alt="image"
                  width={50}
                  height={50}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </Avatar.Group>
        ) : (
          ""
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render(_: any, record: TProduct) {
        return (
          <Space size={5}>
            <Button
              onClick={() => {
                setIsOpenCEModal(true);
                setProductEdit(record);
              }}
              type="link"
            >
              Edit
            </Button>
            <Popconfirm
              placement="topRight"
              title="Are you sure?"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button type="link">Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
      fixed: "right",
      width: 180,
    },
  ];

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    const { current, pageSize } = pagination;
    const { order, field } = sorter;
    const page = current;
    const limit = pageSize;
    const sort = field;
    const orderBy = order === "ascend" ? EOrderBy.ASC : EOrderBy.DESC;
    setParams({ ...params, page, limit, sortBy: sort, orderBy: orderBy });
  };
  return (
    <div>
      <Row justify="space-between">
        <Col>
          <Button
            onClick={() => {
              setIsOpenCEModal(true);
              setProductEdit(null);
            }}
            style={{ marginBottom: 12 }}
            type="primary"
          >
            Add+
          </Button>
        </Col>
        <Col>
          <Input.Search
            onSearch={(value) => {
              setParams((prev) => ({ ...prev, page: 1, s: value }));
            }}
            name="search"
            placeholder="Search"
            allowClear
          />
        </Col>
      </Row>
      <Table
        pagination={{
          current: params.page || 1,
          pageSize: params.limit,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["4", "8", "12"],
        }}
        onChange={handleChange}
        dataSource={listProduct}
        columns={columns}
      />
      <CEModal
        isOpenCEModal={isOpenCEModal}
        setIsOpenCEModal={setIsOpenCEModal}
        setProductEdit={setProductEdit}
        productEdit={productEdit}
      />
    </div>
  );
}
