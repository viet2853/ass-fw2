import { TUser } from "../@types/auth.type";

export const setProfileToLS = (data: { accessToken: string; user: TUser }) => {
  localStorage.setItem("profile", JSON.stringify(data));
};

export const getProfileFromLS: () => {
  accessToken: string;
  user: TUser;
} = () => {
  const profile = localStorage.getItem("profile");
  return profile ? JSON.parse(profile) : null;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
