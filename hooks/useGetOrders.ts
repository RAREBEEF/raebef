import { FirebaseError } from "firebase/app";
import { useInfiniteQuery, useQuery } from "react-query";
import {
  collection,
  DocumentData,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../fb";
import { OrderData, OrderFilterType } from "../types";
import fakeDelay from "../tools/fakeDelay";

/**
 * 조건에 맞는 주문 데이터와 그 수량을 불러온다. (react-query의 무한 스크롤 적용)
 * 관리자 여부에 따라 제한사항이 적용.
 * @param filter 필터
 * @param uid 유저 id
 * @param isAdmin 관리자 여부
 * @returns data, count
 * */
const useGetOrders = ({
  filter,
  uid,
  isAdmin = false,
}: {
  filter: OrderFilterType;

  uid?: string;
  isAdmin?: boolean;
}) => {
  const data = useInfiniteQuery<any, FirebaseError>({
    queryKey: ["orders", uid, filter, isAdmin],
    queryFn: ({ pageParam }) => getOrders(pageParam, filter, uid, isAdmin),
    getNextPageParam: (lastPage, pages) => lastPage?.lastVisible,
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 300000,
  });

  const count = useQuery<any, FirebaseError>({
    queryKey: ["ordersCount", filter, uid, isAdmin],
    queryFn: () => getOrdersCount(filter, uid, isAdmin),
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 300000,
    staleTime: 300000,
  });

  return { data, count };
};

export default useGetOrders;

// 데이터 불러오기
const getOrders = async (
  pageParam: DocumentData,
  filter: OrderFilterType,
  uid?: string,
  isAdmin?: boolean
) => {
  if (uid === "") return;

  const result: { orders: Array<OrderData>; lastVisible: DocumentData | null } =
    { orders: [], lastVisible: null };

  const queries: Array<QueryConstraint> = [limit(12)];

  // orderby
  if (!filter.orderby || filter.orderby === "updated") {
    queries.push(orderBy("updatedAt", "desc"));
  } else if (filter.orderby === "createdAt") {
    queries.push(orderBy("createdAt", "desc"));
  } else if (filter.orderby === "createdAtAcs") {
    queries.push(orderBy("createdAt", "asc"));
  }

  // uid
  if (isAdmin && filter.uid) {
    queries.push(where("uid", "==", filter.uid));
  } else if (!isAdmin) {
    queries.push(where("uid", "==", uid));
  }

  // orderID
  if (filter.orderId) {
    queries.push(where("orderId", "==", filter.orderId));
  }

  // status
  if (filter.status && filter.status !== "all") {
    queries.push(where("status", "==", filter.status));
  } else if (!isAdmin) {
    queries.push(
      where("status", "in", [
        "Payment completed",
        "Preparing product",
        "Shipping in progress",
        "Refund completed",
        "Complete",
      ])
    );
  }

  if (pageParam) {
    queries.push(startAfter(pageParam));
  }

  const q = query(collection(db, "orders"), ...queries);

  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    result.orders.push(doc.data() as OrderData);
  });

  result.lastVisible = snapshot.docs[snapshot.docs.length - 1];

  fakeDelay(300).then(() => {
    console.log("delay");
  });

  return result;
};

// 수량 불러오기
const getOrdersCount = async (
  filter: OrderFilterType,
  uid?: string,
  isAdmin?: boolean
) => {
  if (uid === "") return;

  let totalCount: number = 0;

  const queries: Array<QueryConstraint> = [];

  // uid
  if (isAdmin && filter.uid) {
    queries.push(where("uid", "==", filter.uid));
  } else if (!isAdmin) {
    queries.push(where("uid", "==", uid));
  }

  // orderID
  if (filter.orderId) {
    queries.push(where("orderId", "==", filter.orderId));
  }

  // status
  if (filter.status && filter.status !== "all") {
    queries.push(where("status", "==", filter.status));
  } else if (!isAdmin) {
    queries.push(
      where("status", "in", [
        "Payment completed",
        "Preparing product",
        "Shipping in progress",
        "Refund completed",
        "Complete",
      ])
    );
  }

  const q = query(collection(db, "orders"), ...queries);

  const snapshot = await getCountFromServer(q);

  totalCount = snapshot.data().count;

  return totalCount;
};
