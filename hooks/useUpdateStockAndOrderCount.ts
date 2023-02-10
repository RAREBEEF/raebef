import { useMutation, useQueryClient } from "react-query";
import { doc, FieldValue, increment, updateDoc } from "firebase/firestore";
import { db } from "../fb";
import { CartType, SizeType } from "../types";

/**
 * 주문에 맞춰 재고량 업데이트
 */
const useUpdateStockAndOrderCount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(updateStockAndOrderCount, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [
          "productsByFilter",
          "productsCountByFilter",
          "productsById",
          "productsFromCart",
        ],
        refetchInactive: true,
      }),
    retry: false,
  });

  return mutation;
};

export default useUpdateStockAndOrderCount;

const updateStockAndOrderCount = async ({
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
      const stockDotNotation = `stock.${size}`;

      newStock[stockDotNotation] = increment(restore ? count : -count);
      newStock["orderCount"] = increment(restore ? -count : count);
    });

    await updateDoc(docRef, newStock);
  });
};
