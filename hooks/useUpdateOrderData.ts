import { useMutation, useQueryClient } from "react-query";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../fb";
import { OrderData } from "../types";

const UpdateOrderData = async ({
  orderId,
  status,
  paymentData,
}: {
  orderId: string;
  status:
    | "Payment in progress"
    | "Payment completed"
    | "Payment failed"
    | "Shipping in progress"
    | "Complete";
  paymentData?: { [key: string]: any };
}) => {
  const docRef = doc(db, "orders", orderId);

  await updateDoc(docRef, {
    ...paymentData,
    status,
  } as OrderData).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};

const useUpdateOrderData = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation("order", UpdateOrderData, {
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
  });

  return mutation;
};

export default useUpdateOrderData;
