import { useMutation, useQueryClient } from "react-query";
import {
  doc,
  FieldValue,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../fb";
import { CartType, SizeType } from "../types";
import axios from "axios";

/**
 * 카트 데이터에 맞춰 해당하는 제품의 재고와 주문수량을 업데이트한다.
 * @return mutation
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

/**
 * 전달한 카트 데이터에 맞춰 해당하는 제품의 재고와 주문수량을 업데이트한다.
 * @param cart 카트 데이터
 * @param restore 복구 여부, 기본값인 false일 경우 재고 수량 차감, 주문 수량 증가
 * */
const updateStockAndOrderCount = async ({
  cart,
  amount,
  restore = false,
}: {
  cart: CartType;
  amount: number;
  restore?: boolean;
}) => {
  // 재고, 제품 주문건수 증가
  Object.entries(cart).forEach(async (el) => {
    const [productId, stock] = el;

    const docRef = doc(db, "products", productId);

    const newStock: { [key in string]: FieldValue } = {};

    Object.entries(stock).forEach((el) => {
      const [size, count] = el as [SizeType, number];
      const stockDotNotation = `stock.${size}`;

      newStock[stockDotNotation] = increment(restore ? count : -count);
      newStock.totalStock = increment(restore ? count : -count);
      newStock.orderCount = increment(restore ? -count : count);
    });

    await updateDoc(docRef, newStock);
  });

  // 대시보드 기록
  const newDashboard = {
    amount: increment(restore ? -amount : amount),
    orders: increment(restore ? -1 : 1),
  };

  const today = new Date();
  const curYear = today.getFullYear();
  const curMonth = today.getMonth() + 1;
  const monthly = `${curYear}-${curMonth.toString().padStart(2, "0")}`;

  const dashDocRef = doc(db, "dashboard", monthly);

  await updateDoc(dashDocRef, newDashboard).catch((error) => {
    switch (error.code) {
      // 필드가 없을 경우 새로 추가
      case "not-found":
        setDoc(dashDocRef, newDashboard);
        break;
      default:
        console.error(error);
        break;
    }
  });
};

/**
 * 정적 페이지 업데이트,
 * 아쉽지만 netlify에서는 on-demand revalidation을 지원하지 않는다.
 * */
// const revalidate = async (cart: CartType) => {
//   await axios.request({
//     method: "POST",
//     url:
//       process.env.NEXT_PUBLIC_ABSOLUTE_URL +
//       "/api/revalidate?secret=" +
//       process.env.NEXT_PUBLIC_REVALIDATE_TOKEN,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: { target: "product", id: Object.keys(cart) },
//   });
// };
