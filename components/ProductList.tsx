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

    // 제품 목록이 항상 일정한 레이아웃을 유지할 수 있도록
    // 뷰포트 크기와 제품 개수에 맞춰 남은 빈자리를 채운다.
    switch (isFetching) {
      case true: {
        if (innerWidth >= 1024) {
          setSkeletonCount(12 + (4 - (productsLength % 4)));
        } else if (innerWidth > 400) {
          setSkeletonCount((productsLength % 2) + 6);
        } else {
          setSkeletonCount(3);
        }
        break;
      }
      case false: {
        if (productsLength && innerWidth >= 1024) {
          setSkeletonCount(4 - (productsLength % 4));
        } else if (innerWidth > 400) {
          setSkeletonCount(productsLength % 2);
        } else {
          setSkeletonCount(0);
        }
        break;
      }
    }
  }, [products, isFetching, innerWidth]);

  // 개수에 맞게 스켈레톤 로더 생성하기
  const skeletonGenerator = (count: number) => {
    const skeletonList: Array<ReactNode> = [];
    for (let i = 0; i < count; i++) {
      skeletonList.push(
        <SkeletonProductCard key={i} isFetching={isFetching} />
      );
    }

    return skeletonList;
  };

  return (
    <ul className="w-full pt-12 px-12 flex flex-wrap justify-center gap-10 gap-x-[4%] xs:px-5">
      {children}
      {products?.map((product, i) => (
        <ProductCard product={product} key={i} />
      ))}
      {skeletonGenerator(skeletonCount)}
    </ul>
  );
};

export default ProductList;
