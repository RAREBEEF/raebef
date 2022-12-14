import { useRouter } from "next/router";
import React, { MouseEvent, useEffect, useState } from "react";
import ProductList from "../../components/ProductList";
import Filter from "../../components/Filter";
import Button from "../../components/Button";
import { useInfiniteQuery, useQuery } from "react-query";
import getProducts from "../api/getProducts";
import { FilterType, ProductType } from "../../types";
import { FirebaseError } from "firebase/app";
import useReportError from "../../hooks/useReportError";
import getProductsCount from "../api/getProductsCount";

const Categories = () => {
  const reportError = useReportError();
  const { back, asPath } = useRouter();
  const [products, setProducts] = useState<Array<ProductType>>([]);
  const [filter, setFilter] = useState<FilterType>({
    category: "",
    subCategory: "",
    gender: "",
    size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
    color: "",
    order: "orderCount",
  });

  console.log(filter);

  // 상품 목록 쿼리
  const { status, data, error, fetchNextPage } = useInfiniteQuery<
    any,
    FirebaseError
  >({
    queryKey: ["products", filter],
    queryFn: ({ pageParam }) => getProducts(filter, pageParam),
    getNextPageParam: (lastPage, pages) => lastPage.lastVisible,
    retry: false,
  });

  // 총 상품 수 쿼리
  const {
    status: countStatus,
    data: totalCount,
    error: countError,
  } = useQuery(["totalCount", filter], () => getProductsCount(filter), {
    retry: false,
  });

  // 불러온 상품 데이터를 상태로 저장
  useEffect(() => {
    let productList: Array<ProductType> = [];

    data?.pages.forEach((page) =>
      page?.products.forEach((product: ProductType) => {
        productList.push(product);
      })
    );

    setProducts(productList);
  }, [data]);

  // 더 보기 버튼
  const onLoadMore = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchNextPage();
  };

  // 쿼리 상태 처리
  useEffect(() => {
    if (!status) return;

    switch (status) {
      case "error":
        if (error?.code === "failed-precondition") {
          window?.alert("정의되지 않은 복합 필드 색인입니다.");
        }

        const errorReport = {
          uid: "test",
          url: asPath,
          errorMessage: error.message,
          errorCode: error.code,
          filter: filter,
        };

        reportError(errorReport);

        back();
        break;

      case "success":
        break;

      case "loading":
        break;

      default:
        break;
    }
  }, [status, error, filter, back, asPath, reportError]);

  return (
    <div className="page-container">
      <Filter
        filter={filter}
        setFilter={setFilter}
        productsLength={totalCount || 0}
      />
      <ProductList products={products} />
      <div className="mx-auto text-center mt-10">
        {totalCount && products.length < totalCount ? (
          <Button tailwindStyles="w-[200px]" onClick={onLoadMore}>
            더 보기
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Categories;
