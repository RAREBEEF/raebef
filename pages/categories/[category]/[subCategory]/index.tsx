import { useRouter } from "next/router";
import React, { MouseEvent, useEffect, useState } from "react";
import ProductList from "../../../../components/ProductList";
import Filter from "../../../../components/Filter";
import Button from "../../../../components/Button";
import { FilterType, ProductType } from "../../../../types";
import useGetProducts from "../../../../hooks/useGetProducts";
import { doc, DocumentData, setDoc } from "firebase/firestore";
import { db } from "../../../../fb";
import { v4 as uuidv4 } from "uuid";
import useGetProductsCount from "../../../../hooks/useGetProductsCount";

const Categories = () => {
  const { back, asPath } = useRouter();
  const [products, setProducts] = useState<Array<ProductType>>([]);
  const [filter, setFilter] = useState<FilterType>({
    category: "",
    subCategory: "",
    gender: 1,
    size: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
    color: "",
    order: "orderCount",
  });

  // 에러 처리
  const errorHandler = (query: any) => {
    const sendErrorReport = async () => {
      const errorReport = {
        uid: "test",
        url: asPath,
        errorMessage: query.error?.message,
        errorCode: query.error?.code,
        filter: filter,
      };

      await setDoc(doc(db, "error", uuidv4()), errorReport).then(() => {
        window.alert("에러 보고서가 전송되었습니다.\n감사합니다.");
      });
    };

    if (query.error?.code === "failed-precondition") {
      window?.alert("정의되지 않은 복합 필드 색인입니다.");

      window.confirm(
        "필드 색인 추가를 위해 에러 정보를 전송 하시겠습니까?\n보내주신 에러 보고서는 사이트 이용 경험 개선에 큰 도움이 됩니다."
      ) && sendErrorReport();
    } else {
      window?.alert(
        "상품을 불러오는 과정에서 문제가 발생 하였습니다.\n잠시 후 다시 시도해 주세요."
      );
    }

    back();
  };

  // 상품 목록 쿼리
  const {
    status: productsStatus,
    data: productsData,
    error: productsError,
    isFetching,
    fetchNextPage,
  } = useGetProducts(filter, errorHandler);

  // 총 상품 수 쿼리
  const {
    status: totalCountStatus,
    data: totalCountData,
    error: totalCountError,
  } = useGetProductsCount(filter, errorHandler);

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
    <div className="page-container">
      <Filter
        filter={filter}
        setFilter={setFilter}
        productsLength={totalCountData || 0}
      />
      <ProductList products={products} isFetching={isFetching} />
      {!isFetching && products.length < 1 && (
        <p className="w-full mt-[10vh] text-center text-zinc-600 text-lg font-semibold">
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
    </div>
  );
};

export default Categories;
