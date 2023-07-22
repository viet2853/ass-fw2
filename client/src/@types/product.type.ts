export type TProduct = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type TResListProductData = {
  docs: TProduct[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export enum EOrderBy {
  ASC = "asc",
  DESC = "desc",
}
export enum ESortBy {
  NAME = "name",
  PRICE = "price",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export type TQueryParamsProduct = {
  page?: number;
  limit?: number;
  orderBy?: EOrderBy;
  sortBy?: ESortBy;
  s?: string;
  categoryId?: string;
};
