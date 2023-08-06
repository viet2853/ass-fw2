import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TProduct } from "../../../@types/product.type";
import { baseCreateApi } from "../../../api/config";
import { TResListSuccess } from "../../../@types/common.type";

export const productApi = createApi({
  ...baseCreateApi({ reducerPath: "products", tagTypes: ["Products"] }),
  endpoints: (build) => ({
    getProducts: build.query<TResListSuccess<TProduct[]>, any>({
      query: (params) => ({
        url: "products",
        method: "GET",
        params,
      }),
      providesTags(result) {
        if (result) {
          const { data } = result;
          const final =
            data?.length > 0
              ? data.map(({ _id }) => ({
                  type: "Products" as const,
                  id: _id,
                }))
              : [];

          return [...final, { type: "Products" as const, id: "LIST" }];
        }
        return [{ type: "Products", id: "LIST" }];
      },
    }),
    addProduct: build.mutation<TProduct, Omit<TProduct, "_id">>({
      query(body) {
        try {
          return {
            url: "products",
            method: "POST",
            body,
          };
        } catch (error: any) {
          throw new Error(error?.message);
        }
      },
      invalidatesTags: (result, error, body) =>
        error ? [] : [{ type: "Products", id: "LIST" }],
    }),
    getProduct: build.query<TProduct, string>({
      query: (id) => ({
        url: `products/${id}`,
      }),
    }),
    updateProduct: build.mutation<TProduct, { id: string; body: TProduct }>({
      query(data) {
        return {
          url: `products/${data.id}`,
          method: "PATCH",
          body: data.body,
        };
      },
      invalidatesTags: (result, error, data) =>
        error ? [] : [{ type: "Products", id: data.id }],
    }),
    deleteProduct: build.mutation<any, string>({
      query(id) {
        return {
          url: `products/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useDeleteProductMutation,
  useAddProductMutation,
  useUpdateProductMutation,
} = productApi;
