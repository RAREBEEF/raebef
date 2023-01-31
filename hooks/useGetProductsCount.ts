import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { FilterType } from "../types";
import {
  collection,
  query,
  where,
  QueryConstraint,
  getCountFromServer,
} from "firebase/firestore";
import { filterData } from "../components/HeaderWithFilter";
import { db } from "../fb";

const useGetProductsCount = (filter: FilterType) => {
  const query = useQuery<any, FirebaseError, number>(
    ["productsCount", filter],
    () => getProductsCount(filter),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return query;
};

export default useGetProductsCount;

const getProductsCount = async (filter: FilterType) => {
  if (
    (!filter.keywords || filter.keywords?.length === 0) &&
    !filter.category &&
    !filter.subCategory
  )
    return;

  let totalCount: number = 0;

  const coll = collection(db, "products");

  const queries: Array<QueryConstraint> = [];

  // 키워드가 있을 경우 키워드만 필터링
  if (filter.keywords && filter.keywords.length !== 0) {
    queries.push(where("tags", "array-contains-any", filter.keywords));
  } else {
    // 카테고리
    if (filter.category) {
      queries.push(where("category", "==", filter.category));
    }
    // 하위 카테고리
    if (filter.subCategory !== "all") {
      queries.push(where("subCategory", "==", filter.subCategory));
    }
    // 성별 필터
    if (filter.gender && filter.gender !== "all") {
      filter.gender === "male"
        ? queries.push(where("gender", "==", "male"))
        : queries.push(where("gender", "==", "female"));
    }
    // 색상 필터
    if (filter.color) {
      queries.push(where("color", "==", filter.color));
    }
    // 사이즈 필터
    if (
      filter.size.length >= 1 &&
      filter.size.length < filterData.size.length
    ) {
      queries.push(where("size", "array-contains-any", filter.size));
    }
  }

  const q = query(coll, ...queries);
  const snapshot = await getCountFromServer(q);

  totalCount = snapshot.data().count;

  return totalCount;
};
