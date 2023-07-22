import { Button, Image, Popconfirm, Space, Table, notification } from "antd";
import React, { useEffect } from "react";
import { ColumnsType } from "antd/es/table";
import { TResError } from "../../../@types/common.type";
import CEModal from "./components/CEModal";
import { deleteCategory, getCategories } from "../../../api/category.api";
import { TCategory } from "../../../@types/category.type";

export default function CategoriesAdmin() {
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const [isOpenCEModal, setIsOpenCEModal] = React.useState(false);
  const [categoryEdit, setCategoryEdit] = React.useState<TCategory | null>(
    null
  );

  useEffect(() => {
    const fetchAllCategories = async () => {
      const { data } = await getCategories();
      setCategories(data.data as TCategory[]);
    };
    fetchAllCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { data } = await deleteCategory(id);
      setCategories(categories.filter((category) => category._id !== id));
      notification.success({ message: data.message });
    } catch (error) {
      notification.error({ message: (error as TResError).message });
    }
  };
  const columns: ColumnsType<TCategory> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render(_: any, record: TCategory) {
        return (
          <Space size={5}>
            <Button
              onClick={() => {
                setIsOpenCEModal(true);
                setCategoryEdit(record);
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
  return (
    <div>
      <Button
        onClick={() => {
          setIsOpenCEModal(true);
          setCategoryEdit(null);
        }}
        style={{ marginBottom: 12 }}
        type="primary"
      >
        Add+
      </Button>
      <Table dataSource={categories} columns={columns} />
      <CEModal
        isOpenCEModal={isOpenCEModal}
        setIsOpenCEModal={setIsOpenCEModal}
        setCategoryEdit={setCategoryEdit}
        categoryEdit={categoryEdit}
        setCategories={setCategories}
      />
    </div>
  );
}
