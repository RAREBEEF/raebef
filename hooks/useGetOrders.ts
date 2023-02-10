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

const useGetOrders = ({
  uid,
  isAdmin = false,
}: {
  uid?: string;
  isAdmin?: boolean;
}) => {
  const data = useInfiniteQuery<any, FirebaseError>({
    queryKey: ["orders", uid, isAdmin],
    queryFn: ({ pageParam }) => getOrders(pageParam, uid, isAdmin),
    getNextPageParam: (lastPage, pages) => lastPage?.lastVisible,
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 300000,
  });

  const count = useQuery<any, FirebaseError>({
    queryKey: ["ordersCount", uid, isAdmin],
    queryFn: () => getOrdersCount(uid, isAdmin),
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 300000,
  });

  return { data, count };
};

export default useGetOrders;

// 복수의 주문 데이터를 불러오는 훅
const getOrders = async (
  pageParam: DocumentData,
  uid?: string,
  isAdmin?: boolean
) => {
  if (uid === "") return;

  const result: { orders: Array<OrderData>; lastVisible: DocumentData | null } =
    { orders: [], lastVisible: null };

  const queries: Array<QueryConstraint> = [
    orderBy("updatedAt", "desc"),
    limit(1),
  ];

  if (uid) {
    queries.push(where("uid", "==", uid));
  }

  if (!isAdmin) {
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

  return result;
};

const getOrdersCount = async (uid?: string, isAdmin?: boolean) => {
  if (uid === "") return;

  let totalCount: number = 0;

  const queries: Array<QueryConstraint> = [];

  if (uid) {
    queries.push(where("uid", "==", uid));
  }

  if (!isAdmin) {
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
