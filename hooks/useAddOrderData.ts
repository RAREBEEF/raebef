import { useMutation, useQueryClient } from "react-query";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../fb";
import { OrderData } from "../types";

const addOrderData = async (orderData: OrderData) => {
  const docRef = doc(db, "orders", orderData.orderId);

  await setDoc(docRef, orderData).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};

const useAddOrderData = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation("order", addOrderData, {
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
    onError: (error) => {
      console.error(error);
      window.alert(
        "결제를 준비하는 과정에서 문제가 발생 하였습니다.\n잠시 후 다시 시도해 주세요."
      );
    },
  });

  return mutation;
};

export default useAddOrderData;
