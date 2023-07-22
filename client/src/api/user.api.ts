import { TUser } from "../@types/auth.type";
import { TResListSuccess, TResSuccess } from "../@types/common.type";
import instance from "./config";

export const getUsers = () => instance.get<TResListSuccess<TUser[]>>("/users");
export const getUser = (id: string) =>
  instance.get<TResSuccess<TUser>>(`/users/${id}`);
export const createUser = (data: TUser) =>
  instance.post<TResSuccess<TUser>>("/users", data);
export const updateUser = (id: string, data: Omit<TUser, "_id">) =>
  instance.patch<TResSuccess<TUser>>(`/users/${id}`, data);
export const deleteUser = (id: string) =>
  instance.delete<TResSuccess<TUser>>(`/users/${id}`);
