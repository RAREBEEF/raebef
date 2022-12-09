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
import { filterData } from "../../components/Filter";
import { db } from "../../fb";
import { FilterType, ProductType } from "../../types";

const getProducts = async (
  category: { category: string; subCategory?: string },
  filter: FilterType,
  pageParam: DocumentData
) => {
  if (!category) return;

  const result: {
    products: Array<ProductType>;
    totalCount: number;
    lastVisible: DocumentData | null;
  } = {
    products: [],
    totalCount: 0,
    lastVisible: null,
  };

  const coll = collection(db, "products");

  const queries: Array<QueryConstraint> = [
    where("category", "==", category.category),
  ];

  // 하위 카테고리
  if (category.subCategory) {
    queries.push(where("subCategory", "==", category.subCategory));
  }
  // 성별 필터
  if (filter.gender) {
    filter.gender === "male"
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
  // 쿼리 커서
  if (pageParam) {
    queries.push(startAfter(pageParam));
  }

  const q = query(coll, ...queries, limit(1));
  const countQ = query(coll, ...queries);

  const snapshot = await getDocs(q);
  const countSnapshot = await getCountFromServer(countQ);

  result.totalCount = countSnapshot.data().count;
  snapshot.forEach((doc) => {
    const product = doc.data() as ProductType;
    result.products.push(product);
  });
  result.lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return result;
};

export default getProducts;
