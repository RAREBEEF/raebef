import { useRouter } from "next/router";
import React, { MouseEvent, useEffect, useState } from "react";
import Button from "../../../../components/Button";
import { FilterType, ProductType } from "../../../../types";
import useGetProducts from "../../../../hooks/useGetProducts";
import { doc, DocumentData, setDoc } from "firebase/firestore";
import { db } from "../../../../fb";
import { v4 as uuidv4 } from "uuid";
import useGetProductsCount from "../../../../hooks/useGetProductsCount";
import HeaderWithFilter from "../../../../components/HeaderWithFilter";
import ProductList from "../../../../components/ProductList";

const Categories = () => {
  const [products, setProducts] = useState<Array<ProductType>>([]);
  const [filter, setFilter] = useState<FilterType>({
    category: "",
    subCategory: "",
    gender: 1,
    size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
    color: "",
    order: "orderCount",
  });

  // 상품 목록 쿼리
  const {
    data: productsData,
    isFetching,
    isError,
    fetchNextPage,
  } = useGetProducts(filter);

  // 총 상품 수 쿼리
  const { data: totalCountData } = useGetProductsCount(filter);

  // 불러온 상품 데이터를 상태로 저장
  useEffect(() => {
    let productList: Array<ProductType> = [];

    productsData?.pages.forEach(
      (page: {
        products: Array<ProductType>;
        lastVisible: DocumentData | null;
      }) =>
        page?.products.forEach((product: ProductType) => {
          productList.push(product);
        })
    );

    setProducts(productList);
  }, [productsData]);

  // 더 보기 버튼
  const onLoadMore = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchNextPage();
  };

  return (
    <main className="page-container min-h-[50vh] flex flex-col">
      <HeaderWithFilter
        filter={filter}
        setFilter={setFilter}
        productsLength={totalCountData || 0}
      />
      {!isError ? (
        <React.Fragment>
          <ProductList products={products} isFetching={isFetching} />
          {!isFetching && products.length < 1 && (
            <p className="w-full flex grow items-center justify-center mt-24 text-center text-zinc-600 text-lg font-semibold break-keep">
              해당하는 제품이 존재하지 않습니다.
            </p>
          )}
          {!isFetching &&
          totalCountData &&
          Object.keys(products).length < totalCountData ? (
            <div className="mx-auto text-center mt-10">
              <Button tailwindStyles="w-[200px]" onClick={onLoadMore}>
                더 보기
              </Button>
            </div>
          ) : null}
        </React.Fragment>
      ) : (
        <p className="w-full mt-[10vh] text-center text-zinc-600 text-lg font-semibold break-keep">
          제품 목록을 가져오는 과정에서 문제가 발생하였습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
      )}
    </main>
  );
};

export default Categories;
