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
import { OrderData } from "../types";

const useGetOrders = (uid?: string) => {
  const data = useInfiniteQuery<any, FirebaseError>({
    queryKey: ["order", uid],
    queryFn: ({ pageParam }) => getOrders(pageParam, uid),
    getNextPageParam: (lastPage, pages) => lastPage?.lastVisible,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const count = useQuery<any, FirebaseError>({
    queryKey: ["ordersCount", uid],
    queryFn: () => getOrdersCount(uid),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { data, count };
};

export default useGetOrders;

// 복수의 주문 데이터를 불러오는 훅
const getOrders = async (pageParam: DocumentData, uid?: string) => {
  if (uid === "") return;

  console.log(uid);

  const result: { orders: Array<OrderData>; lastVisible: DocumentData | null } =
    { orders: [], lastVisible: null };

  const queries: Array<QueryConstraint> = [
    orderBy("payment.approvedAt", "desc"),
    where("status", "in", [
      "Payment completed",
      "Preparing product",
      "Shipping in progress",
      "Refund completed",
      "Complete",
    ]),
    limit(10),
  ];

  if (uid) {
    queries.push(where("uid", "==", uid));
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

  return result;
};

const getOrdersCount = async (uid?: string) => {
  if (uid === "") return;

  let totalCount: number = 0;

  const queries: Array<QueryConstraint> = [
    where("status", "in", [
      "Payment completed",
      "Preparing product",
      "Shipping in progress",
      "Refund completed",
      "Complete",
    ]),
  ];

  if (uid) {
    queries.push(where("uid", "==", uid));
  }

  const q = query(collection(db, "orders"), ...queries);

  const snapshot = await getCountFromServer(q);

  totalCount = snapshot.data().count;

  return totalCount;
};
