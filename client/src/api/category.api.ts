import { TCategory } from "../@types/category.type";
import { TResListSuccess, TResSuccess } from "../@types/common.type";
import instance from "./config";

export const getCategories = () =>
  instance.get<TResListSuccess<TCategory[]>>("/categories");
export const getCategory = (id: string) =>
  instance.get<TResSuccess<TCategory>>(`/categories/${id}`);
export const createCategory = (data: TCategory) =>
  instance.post<TResSuccess<TCategory>>("/categories", data);
export const updateCategory = (id: string, data: Omit<TCategory, "_id">) =>
  instance.patch<TResSuccess<TCategory>>(`/categories/${id}`, data);
export const deleteCategory = (id: string) =>
  instance.delete<TResSuccess<TCategory>>(`/categories/${id}`);
