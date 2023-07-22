import { Button, Popconfirm, Space, Table, notification } from "antd";
import React, { useEffect } from "react";
import { deleteProduct } from "../../../api/product.api";
import { ColumnsType } from "antd/es/table";
import { TResError } from "../../../@types/common.type";
import CEModal from "./components/CEModal";
import { deleteUser, getUsers } from "../../../api/user.api";
import { TUser } from "../../../@types/auth.type";

export default function UsersAdmin() {
  const [users, setUsers] = React.useState<TUser[]>([]);
  const [isOpenCEModal, setIsOpenCEModal] = React.useState(false);
  const [userEdit, setUserEdit] = React.useState<TUser | null>(null);

  useEffect(() => {
    const fetchAllUser = async () => {
      const { data } = await getUsers();
      setUsers(data.data as TUser[]);
    };
    fetchAllUser();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { data } = await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
      notification.success({ message: data.message });
    } catch (error) {
      notification.error({ message: (error as TResError).message });
    }
  };
  const columns: ColumnsType<TUser> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render(_: any, record: TUser) {
        return (
          <Space size={5}>
            <Button
              onClick={() => {
                setIsOpenCEModal(true);
                setUserEdit(record);
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
      <Table dataSource={users} columns={columns} />
      <CEModal
        isOpenCEModal={isOpenCEModal}
        setIsOpenCEModal={setIsOpenCEModal}
        setUserEdit={setUserEdit}
        userEdit={userEdit}
        setUsers={setUsers}
      />
    </div>
  );
}
