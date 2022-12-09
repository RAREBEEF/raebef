import { ReactElement } from "react";
import { ProductType } from "../types";
import ProductCard from "./ProductCard";

interface Props {
  products: Array<ProductType> | undefined;
  children?: ReactElement;
}

const ProductList: React.FC<Props> = ({ products, children }) => {
  return (
    <ul className="w-full pt-12 flex flex-wrap justify-center gap-10 gap-x-[4%] px-5">
      {children}
      {products?.map((product, i) => (
        <ProductCard product={product} key={i} />
      ))}
    </ul>
  );
};

export default ProductList;
