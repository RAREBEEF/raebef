import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../fb";
import { OrderData } from "../types";
import { FirebaseError } from "firebase/app";

// 단일 주문 데이터를 불러오고 처리하는 훅
const useOrderData = (orderId?: string) => {
  const queryClient = useQueryClient();

  const get = useQuery<any, FirebaseError, OrderData>({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderData(orderId || ""),
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 300000,
  });

  const add = useMutation(addOrderData, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["orders"],
        refetchInactive: true,
      }),
    onError: (error) => {
      console.error(error);
      window.alert(
        "결제를 준비하는 과정에서 문제가 발생 하였습니다.\n잠시 후 다시 시도해 주세요."
      );
    },
  });

  const remove = useMutation(removeOrderData, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["orders"],
        refetchInactive: true,
      }),
  });

  const update = useMutation(updateOrderData, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["orders"],
        refetchInactive: true,
      }),
  });

  return { get, add, remove, update };
};

export default useOrderData;

// 주문 데이터 가져오기
const getOrderData = async (orderId: string) => {
  if (!orderId) return;

  const docRef = doc(db, "orders", orderId);

  const docSnap = await getDoc(docRef);

  const result = docSnap.data() as OrderData;

  if (!result) throw new Error("일치하는 주문 데이터 없음");

  return result;
};

// 주문 데이터 추가
const addOrderData = async ({
  orderId,
  orderData,
}: {
  orderId: string;
  orderData: { [key in string]: any };
}) => {
  if (!orderId) return;

  const docRef = doc(db, "orders", orderId);

  await setDoc(docRef, orderData).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};

// 주문 데이터 제거
const removeOrderData = async (orderId: string) => {
  if (!orderId) return;

  const docRef = doc(db, "orders", orderId);

  await deleteDoc(docRef).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};

// 주문 데이터 업데이트
const updateOrderData = async ({
  orderId,
  orderData,
}: {
  orderId: string;
  orderData: { [key in string]: any };
}) => {
  if (!orderId) return;

  const docRef = doc(db, "orders", orderId);

  await updateDoc(docRef, { ...orderData, updatedAt: Date.now() }).catch(
    (error) => {
      switch (error.code) {
        default:
          console.error(error);
          break;
      }
    }
  );
};
