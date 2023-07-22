export type TResSuccess<T> = {
  message: string;
  data?: T;
};

export type TResListSuccess<T> = {
  message: string;
  data?: T;
  total?: number;
};

export type TResError = {
  message: string;
};
