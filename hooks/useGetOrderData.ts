import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../fb";
import { OrderData } from "../types";

const getOrderData = async (orderId: string) => {
  if (!orderId) return;

  const docRef = doc(db, "orders", orderId);

  const docSnap = await getDoc(docRef);

  const result = docSnap.data() as OrderData;

  if (!result) throw new Error("일치하는 주문 데이터 없음");

  return result;
};

const useGetOrderData = (orderId: string) => {
  const query = useQuery<any, FirebaseError, OrderData>({
    queryKey: ["order", orderId],
    queryFn: () => getOrderData(orderId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useGetOrderData;
