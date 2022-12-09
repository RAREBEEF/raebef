import { Timestamp } from "firebase/firestore";
import { ReactNode } from "react";

export interface CollectionType {
  id: string;
  title: string;
  subTitle: string;
  titlePos: Array<string>;
  img: { src: string };
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
  img: {
    src: string;
  };
  detailImgs: Array<string>;
  date: typeof Timestamp;
  /**
   * 0 = male,
   * 1 = none,
   * 2 = female
   */
  gender: 0 | 1 | 2;
  color: string;
  orderCount: number;
  stock: number;
  size: Array<string>;
}

export interface FilterType {
  // gender: Array<GenderType>;
  gender: GenderType | "";
  size: Array<SizeType>;
  // color: Array<ColorType>;
  color: ColorType | "";
  order: OrderType;
}

export type FilterNameType = "gender" | "size" | "color";
export type GenderType = "male" | "female";
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
