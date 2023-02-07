import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
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
  getCountFromServer,
} from "firebase/firestore";
import { filterData } from "../components/HeaderWithFilter";
import { db } from "../fb";
import { FilterType, ProductType } from "../types";

const useGetProductsByFilter = (filter: FilterType) => {
  const [isStale, setIsStale] = useState<boolean>(false);
  const data = useInfiniteQuery<any, FirebaseError>({
    queryKey: ["products", filter],
    queryFn: ({ pageParam }) => getProductsByFilter(filter, pageParam),
    getNextPageParam: (lastPage, pages) => lastPage?.lastVisible,
    retry: false,
    enabled: isStale,
    refetchOnWindowFocus: false,
  });
  const count = useQuery<any, FirebaseError, number>(
    ["productsCount", filter],
    () => getProductsCount(filter),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setIsStale(data.isStale);
  }, [data.isStale]);

  return { data, count };
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
  } else if (filter.category) {
    // 전체 카테고리 아닐 경우
    if (filter.category !== "all") {
      // 카테고리 필터
      queries.push(where("category", "==", filter.category));

      // 하위 카테고리
      if (filter.subCategory !== "all") {
        queries.push(where("subCategory", "==", filter.subCategory));
      }
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

  // 쿼리 커서
  if (pageParam) {
    queries.push(startAfter(pageParam));
  }

  const q = query(coll, ...queries, limit(12));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    result.products.push(doc.data() as ProductType);
  });

  result.lastVisible = snapshot.docs[snapshot.docs.length - 1];

  await sleep(500).then(() => {
    console.log("delay");
  });

  return result as {
    products: Array<ProductType>;
    lastVisible: DocumentData | null;
  };
};

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

  // 키워드가 있을 경우 키워드만 필터링, 파이어베이스 쿼리 제한 때문에 자세한 필터링은 불가능하다.
  if (filter.keywords && filter.keywords.length !== 0) {
    queries.push(where("tags", "array-contains-any", filter.keywords));
  } else if (filter.category) {
    // 전체 카테고리 아닐 경우
    if (filter.category !== "all") {
      // 카테고리 필터
      queries.push(where("category", "==", filter.category));

      // 하위 카테고리
      if (filter.subCategory !== "all") {
        queries.push(where("subCategory", "==", filter.subCategory));
      }
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

function sleep(ms: number) {
  return new Promise((f) => setTimeout(f, ms));
}