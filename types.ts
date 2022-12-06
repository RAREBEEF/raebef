export interface CollectionDataType {
  id: string;
  title: string;
  subTitle: string;
  titlePos: Array<string>;
  img: { src: string };
  tags: string;
  items: Array<string>;
}

export interface ProductType {
  id: string;
  name: string;
  price: number;
  tags: string;
  categories: Array<string>;
  img: {
    src: string;
  };
}

export interface FilterType {
  gender: Array<"male" | "female">;
  size: Array<"xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl">;
  color: Array<
    "black" | "white" | "gray" | "red" | "orange" | "blue" | "skyblue" | "green"
  >;
}
