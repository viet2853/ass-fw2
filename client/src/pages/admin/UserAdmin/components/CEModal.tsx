import { Form, Input, Modal, Select, notification } from "antd";
import React, { useEffect } from "react";
import { createUser, updateUser } from "../../../../api/user.api";
import { TUser } from "../../../../@types/auth.type";

type IProps = {
  userEdit?: TUser | null;
  setUserEdit: React.Dispatch<React.SetStateAction<TUser | null>>;
  isOpenCEModal: boolean;
  setIsOpenCEModal: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<TUser[]>>;
};
export default function CEModal({
  isOpenCEModal,
  setIsOpenCEModal,
  setUserEdit,
  userEdit,
  setUsers,
}: IProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      role: userEdit?.role,
    });
  }, [userEdit]);

  const onClose = () => {
    form.resetFields();
    setUserEdit(null);
    setIsOpenCEModal(false);
  };

  const onFinish = (values: any) => {
    if (userEdit) {
      (async () => {
        const { data } = await updateUser(userEdit._id, values);
        setUsers((prev) => {
          return prev.map((user) => {
            if (user._id === userEdit._id) {
              return { ...user, ...values };
            }
            return user;
          });
        });
        notification.success({ message: data.message });
      })();
    } else {
      (async () => {
        const { data } = await createUser(values);
        setUsers((prev) => {
          return [...prev, data.data as TUser];
        });
        notification.success({ message: data.message });
      })();
    }
    onClose();
  };

  return (
    <Modal
      open={isOpenCEModal}
      title="Edit user"
      onOk={() => form.submit()}
      onCancel={onClose}
      okText="Save"
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="role" label="Role">
          <Select placeholder="Select a member">
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="member">Member</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
