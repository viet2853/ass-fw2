import { TResListSuccess, TResSuccess } from "../@types/common.type";
import { TProduct, TQueryParamsProduct } from "../@types/product.type";
import instance from "./config";

export const getProducts = (params: TQueryParamsProduct) =>
  instance.get<TResListSuccess<TProduct[]>>("/products", { params });
export const getProduct = (id: string) =>
  instance.get<TResSuccess<TProduct>>(`/products/${id}`);
export const createProduct = (data: TProduct) =>
  instance.post<TResSuccess<TProduct>>("/products", data);
export const updateProduct = (id: string, data: Omit<TProduct, "_id">) =>
  instance.patch<TResSuccess<TProduct>>(`/products/${id}`, data);
export const deleteProduct = (id: string) =>
  instance.delete<TResSuccess<TProduct>>(`/products/${id}`);
