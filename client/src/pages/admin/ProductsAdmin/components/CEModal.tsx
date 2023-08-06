import { Form, Input, InputNumber, Modal, Select, notification } from "antd";
import React, { useEffect } from "react";
import { TProduct } from "../../../../@types/product.type";
import { getCategories } from "../../../../api/category.api";
import { TCategory } from "../../../../@types/category.type";
import InputUploadGallery from "./InputFile";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../products.service";

type IProps = {
  productEdit?: TProduct | null;
  setProductEdit: React.Dispatch<React.SetStateAction<TProduct | null>>;
  isOpenCEModal: boolean;
  setIsOpenCEModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function CEModal({
  isOpenCEModal,
  setIsOpenCEModal,
  setProductEdit,
  productEdit,
}: IProps) {
  const [form] = Form.useForm();
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  useEffect(() => {
    async function fetchAllCategories() {
      const { data } = await getCategories();
      setCategories(data.data as TCategory[]);
    }
    fetchAllCategories();
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      name: productEdit?.name,
      price: productEdit?.price,
      description: productEdit?.description,
      categoryId: productEdit?.categoryId,
      images: productEdit?.images,
    });
  }, [productEdit?._id]);

  const onClose = () => {
    form.resetFields();
    setProductEdit(null);
    setIsOpenCEModal(false);
  };

  const [update] = useUpdateProductMutation();
  const [add] = useAddProductMutation();

  const onFinish = async (values: any) => {
    console.log("🚀 ~ file: CEModal.tsx:54 ~ onFinish ~ values:", values);
    if (productEdit) {
      await update({ id: productEdit._id, body: values });
      notification.success({ message: "Update Product Sucess" });
    } else {
      await add(values);
      notification.success({ message: "Add ProductSucess" });
    }
    onClose();
  };

  return (
    <Modal
      open={isOpenCEModal}
      title="Create/Edit product"
      onOk={() => form.submit()}
      onCancel={onClose}
      okText="Save"
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Name is required!",
            },
          ]}
        >
          <Input placeholder="Please type" />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[
            {
              required: true,
              message: "Price is required!",
            },
          ]}
        >
          <InputNumber
            placeholder="Please type price"
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Description is required!",
            },
          ]}
        >
          <Input placeholder="Please type description" />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[
            {
              required: true,
              message: "Category is required!",
            },
          ]}
        >
          <Select placeholder="Select a category" optionFilterProp="children">
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="images"
          label="Gallery"
          // rules={[
          //   {
          //     required: true,
          //     message: "Gallery is required!",
          //   },
          // ]}
        >
          <InputUploadGallery
            form={form}
            files={productEdit ? productEdit.images : []}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
