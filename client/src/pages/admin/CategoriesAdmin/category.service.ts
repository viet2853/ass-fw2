import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TProduct } from "../../../@types/product.type";
import { baseCreateApi } from "../../../api/config";
import { TResListSuccess } from "../../../@types/common.type";
import { TCategory } from "../../../@types/category.type";

export const categoryApi = createApi({
  ...baseCreateApi({ reducerPath: "categories", tagTypes: ["Categories"] }),
  endpoints: (build) => ({
    getCategorys: build.query<TResListSuccess<TCategory[]>, any>({
      query: (params) => ({
        url: "categories",
        method: "GET",
        params,
      }),
      providesTags(result) {
        if (result) {
          const { data } = result;
          const final =
            data?.length > 0
              ? data.map(({ _id }) => ({
                  type: "Categories" as const,
                  id: _id,
                }))
              : [];

          return [...final, { type: "Categories" as const, id: "LIST" }];
        }
        return [{ type: "Categories", id: "LIST" }];
      },
    }),
    addCategory: build.mutation<TCategory, Omit<TCategory, "_id">>({
      query(body) {
        try {
          return {
            url: "categories",
            method: "POST",
            body,
          };
        } catch (error: any) {
          throw new Error(error?.message);
        }
      },
      invalidatesTags: (result, error, body) =>
        error ? [] : [{ type: "Categories", id: "LIST" }],
    }),
    getCategory: build.query<TCategory, string>({
      query: (id) => ({
        url: `categories/${id}`,
      }),
    }),
    updateCategory: build.mutation<TCategory, { id: string; body: TCategory }>({
      query(data) {
        return {
          url: `categories/${data.id}`,
          method: "PATCH",
          body: data.body,
        };
      },
      invalidatesTags: (result, error, data) =>
        error ? [] : [{ type: "Categories", id: data.id }],
    }),
    deleteCategory: build.mutation<any, string>({
      query(id) {
        return {
          url: `categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "Categories", id }],
    }),
  }),
});

export const {
  useGetCategorysQuery,
  useGetCategoryQuery,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
