import { ProductType } from "../types";
import ProductCard from "./ProductCard";

interface Props {
  products: Array<ProductType>;
}

const ProductList: React.FC<Props> = ({ products }) => {
  return (
    <ul className="w-fit pt-16 flex flex-wrap justify-center gap-12 px-10 md:px-5">
      {products.map((product, i) => (
        <ProductCard product={product} key={i} />
      ))}
    </ul>
  );
};

export default ProductList;
