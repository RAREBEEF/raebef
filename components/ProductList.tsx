import { ReactElement, ReactNode, useEffect, useState } from "react";
import { ProductType } from "../types";
import ProductCard from "./ProductCard";
import SkeletonProductCard from "./SkeletonProductCard";
import _ from "lodash";

interface Props {
  products: Array<ProductType>;
  isFetching: boolean;
  children?: ReactElement;
}

const ProductList: React.FC<Props> = ({ products, children, isFetching }) => {
  const [skeletonCount, setSkeletonCount] = useState<number>(12);
  const [innerWidth, setInnerWidth] = useState<number>(0);

  // 뷰포트 너비 구하기
  useEffect(() => {
    const windowResizeListener = () => {
      setInnerWidth(window.innerWidth);
    };

    windowResizeListener();

    window.addEventListener("resize", _.debounce(windowResizeListener, 100));

    return () => {
      window.removeEventListener(
        "resize",
        _.debounce(windowResizeListener, 100)
      );
    };
  }, []);

  // 스켈레톤 로더의 개수를 구한다.
  useEffect(() => {
    if (!products) return;

    const productsLength = products.length;

    if (productsLength && innerWidth >= 1024) {
      setSkeletonCount(4 - (productsLength % 4));
    } else if (innerWidth > 400) {
      setSkeletonCount(productsLength % 2);
    } else {
      setSkeletonCount(0);
    }
  }, [products, isFetching, innerWidth]);

  // 개수에 맞게 스켈레톤 로더 생성하기
  const skeletonGenerator = (count: number) => {
    const skeletonList: Array<ReactNode> = [];
    for (let i = 0; i < count; i++) {
      skeletonList.push(<SkeletonProductCard key={i} />);
    }

    return skeletonList;
  };

  return (
    <ul className="w-full px-12 grid grid-cols-4 gap-16 lg:grid-cols-3 lg:gap-12 md:gap-8 sm:grid-cols-2 xs:grid-cols-1 xs:px-5 xs:gap-12">
      {children}
      {products?.map((product, i) => (
        <ProductCard product={product} key={i} />
      ))}
      {(isFetching || products.length === 0) &&
        skeletonGenerator(skeletonCount + 12)}
    </ul>
  );
};

export default ProductList;
