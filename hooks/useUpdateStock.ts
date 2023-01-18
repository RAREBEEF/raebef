import { useMutation, useQueryClient } from "react-query";
import { doc, FieldValue, increment, updateDoc } from "firebase/firestore";
import { db } from "../fb";
import { CartType, SizeType } from "../types";

const updateStock = async ({
  cart,
  restore = false,
}: {
  cart: CartType;
  restore?: boolean;
}) => {
  Object.entries(cart).forEach(async (el) => {
    const [productId, stock] = el;

    const docRef = doc(db, "products", productId);

    const newStock: { [key in string]: FieldValue } = {};

    Object.entries(stock).forEach((el) => {
      const [size, count] = el as [SizeType, number];
      const dotNotation = `stock.${size}`;

      newStock[dotNotation] = increment(restore ? count : -count);
    });

    await updateDoc(docRef, newStock);
  });
};

/**
 * 주문에 맞춰 재고량 업데이트
 */
const useUpdateStock = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation("products", updateStock, {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
    },
    retry: false,
  });

  return mutation;
};

export default useUpdateStock;
