import { FirebaseError } from "firebase/app";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { FilterType } from "../types";
import {
  collection,
  query,
  where,
  QueryConstraint,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";
import { filterData } from "../components/HeaderWithFilter";
import { db } from "../fb";

const getProductsCount = async (filter: FilterType) => {
  let totalCount: number = 0;

  const coll = collection(db, "products");

  const queries: Array<QueryConstraint> = [
    where("category", "==", filter.category),
  ];

  // 하위 카테고리
  if (filter.subCategory !== "all") {
    queries.push(where("subCategory", "==", filter.subCategory));
  }
  // 성별 필터
  if (filter.gender !== 1) {
    filter.gender === 0
      ? queries.push(where("gender", "<=", 1), orderBy("gender"))
      : queries.push(where("gender", ">=", 1), orderBy("gender"));
  }
  // 정렬
  if (filter.order === "date") {
    queries.push(orderBy("date", "desc"));
  } else if (filter.order === "priceAsc") {
    queries.push(orderBy("price", "asc"));
  } else if (filter.order === "priceDes") {
    queries.push(orderBy("price", "desc"));
  } else {
    queries.push(orderBy("orderCount", "desc"));
  }
  // 색상 필터
  if (filter.color) {
    queries.push(where("color", "==", filter.color));
  }
  // 사이즈 필터
  if (filter.size.length >= 1 && filter.size.length < filterData.size.length) {
    queries.push(where("size", "array-contains-any", filter.size));
  }

  const q = query(coll, ...queries);
  const snapshot = await getCountFromServer(q);

  totalCount = snapshot.data().count;

  return totalCount;
};

const useGetProductsCount = (filter: FilterType) => {
  const query = useQuery<any, FirebaseError, number>(
    ["totalCount", filter],
    () => getProductsCount(filter),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return query;
};

export default useGetProductsCount;
