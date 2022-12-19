import { ReactNode } from "react";

export interface CollectionType {
  id: string;
  enTitle: string;
  title: string;
  subTitle: string;
  titlePos: Array<string>;
  img: ImageType;
  description: string;
  products: Array<string>;
}

export interface ProductType {
  id: string;
  name: string;
  price: number;
  tags: Array<string>;
  category: string;
  subCategory: string;
  thumbnail: ImageType;
  detailImgs: Array<ImageType>;
  date: Date;
  /**
   * 0 = male,
   * 1 = none,
   * 2 = female
   */
  gender: GenderType;
  color: string;
  orderCount: number;
  stock: StockType;
  size: Array<string>;
}

export interface ProductListType {
  [key: string]: ProductType;
}

export interface FilterType {
  category: string;
  subCategory: string;
  gender: GenderType;
  size: Array<SizeType>;
  color: ColorType | "";
  order: OrderType;
}

export type FilterNameType = "gender" | "size" | "color";

export interface StockType {
  xs?: number | "";
  s?: number | "";
  m?: number | "";
  l?: number | "";
  xl?: number | "";
  xxl?: number | "";
  xxxl?: number | "";
}

/**
 * 0 = male,
 * 1 = none,
 * 2 = female
 */
export type GenderType = 0 | 1 | 2;
export type SizeType = "xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl";
export type ColorType =
  | "black"
  | "white"
  | "gray"
  | "red"
  | "orange"
  | "brown"
  | "blue"
  | "skyblue"
  | "green";

export type OrderType = "orderCount" | "date" | "priceAsc" | "priceDes";

export interface FilterCheckbox {
  value: GenderType & ColorType & SizeType;
  text: string;
  children?: ReactNode;
}

export interface ErrorReport {
  uid: string | undefined;
  url: string | undefined;
  errorMessage: string | undefined;
  errorCode: string | undefined;
  filter?: FilterType;
}

export interface Category {
  name: CategoryName;
  path: string;
  subCategories?: Array<Category>;
}

export type CategoryName = "clothes" | "accessory" | "shoes" | "bag" | "jewel";

export interface ImageType {
  src: string;
  id: string;
}
