import { TUser } from "../@types/auth.type";
import { TResSuccess } from "../@types/common.type";
import instance from "./config";

export const login = (data: { email: string; password: string }) =>
  instance.post<TResSuccess<{ accessToken: string; user: TUser }>>(
    "/signin",
    data
  );

export const register = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => instance.post<TResSuccess<TUser>>("/signup", data);
