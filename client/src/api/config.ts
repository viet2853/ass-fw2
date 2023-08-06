import axios from "axios";
import { getProfileFromLS } from "../utils";
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

export const baseURL = "http://localhost:8080/api";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10 * 1000,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = getProfileFromLS()?.accessToken || "";
    if (accessToken && config.headers) {
      config.headers.authorization = `Bearer ${accessToken}`;
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const baseCreateApi = ({
  reducerPath,
  tagTypes,
}: {
  reducerPath: string;
  tagTypes: string[];
}) => {
  const accessToken = getProfileFromLS()?.accessToken || "";
  return {
    reducerPath, // Tên field trong Redux state
    tagTypes, // Những kiểu tag cho phép dùng trong blogApi
    keepUnusedDataFor: 10, // Giữ data trong 10s sẽ xóa (mặc định 60s)
    baseQuery: fetchBaseQuery({
      baseUrl: "http://localhost:8080/api",
      prepareHeaders(headers) {
        headers.set("authorization", `Bearer ${accessToken}`);
        return headers;
      },
    }),
  };
};

export default instance;
