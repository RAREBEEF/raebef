import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import {
  collection,
  getCountFromServer,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { db } from "../fb";

const useGetOrdersCount = (uid?: string) => {
  const query = useQuery<any, FirebaseError>({
    queryKey: ["ordersCount", uid],
    queryFn: () => getOrdersCount(uid),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useGetOrdersCount;

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
