import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import {
  collection,
  query,
  getDocs,
  where,
  QueryConstraint,
  limit,
  orderBy,
  DocumentData,
  startAfter,
} from "firebase/firestore";
import { filterData } from "../components/HeaderWithFilter";
import { db } from "../fb";
import { FilterType, ProductType } from "../types";

const useGetProductsByFilter = (filter: FilterType) => {
  const [isStale, setIsStale] = useState<boolean>(false);
  const query = useInfiniteQuery<any, FirebaseError>({
    queryKey: ["products", filter],
    queryFn: ({ pageParam }) => getProductsByFilter(filter, pageParam),
    getNextPageParam: (lastPage, pages) => lastPage?.lastVisible,
    retry: false,
    enabled: isStale,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setIsStale(query.isStale);
  }, [query.isStale]);

  return query;
};

export default useGetProductsByFilter;

const getProductsByFilter = async (
  filter: FilterType,
  pageParam: DocumentData
) => {
  const result: {
    products: Array<ProductType>;
    lastVisible: DocumentData | null;
  } = {
    products: [],
    lastVisible: null,
  };

  if (
    (!filter.keywords || filter.keywords?.length === 0) &&
    !filter.category &&
    !filter.subCategory
  )
    return;

  const coll = collection(db, "products");

  const queries: Array<QueryConstraint> = [];

  // 키워드가 있을 경우 키워드만 필터링, 파이어베이스 쿼리 제한 때문에 자세한 필터링은 불가능하다.
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

  // 쿼리 커서
  if (pageParam) {
    queries.push(startAfter(pageParam));
  }

  // 정렬
  if (filter.order === "popularity" || !filter.order) {
    queries.push(orderBy("orderCount", "desc"));
  } else if (filter.order === "date") {
    queries.push(orderBy("date", "desc"));
  } else if (filter.order === "priceAsc") {
    queries.push(orderBy("price", "asc"));
  } else if (filter.order === "priceDes") {
    queries.push(orderBy("price", "desc"));
  }

  const q = query(coll, ...queries, limit(20));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    result.products.push(doc.data() as ProductType);
  });

  result.lastVisible = snapshot.docs[snapshot.docs.length - 1];

  await sleep(300).then(() => {
    console.log("delay");
  });

  return result as {
    products: Array<ProductType>;
    lastVisible: DocumentData | null;
  };
};

function sleep(ms: number) {
  return new Promise((f) => setTimeout(f, ms));
}
