import { useQueryClient, useMutation } from "react-query";
import { deleteField, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../fb";
import { CartType, StockType } from "../types";

const useCart = () => {
  const queryClient = useQueryClient();

  const add = useMutation("user", addCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  const remove = useMutation("user", removeCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  const clear = useMutation("user", clearCart, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  return { add, remove, clear };
};

export default useCart;

// 아이템 추가
const addCartItem = async ({
  uid,
  productId,
  options,
}: {
  uid: string;
  productId: string;
  options: StockType;
}) => {
  // 장바구니에 등록할 데이터
  const newCart: CartType = { [`cart.${productId}`]: options };

  // 장바구니 업데이트
  const docRef = doc(db, "users", uid);

  await updateDoc(docRef, newCart).catch((error) => {
    switch (error.code) {
      // 장바구니 필드가 없을 경우 새로 추가
      case "not-found":
        setDoc(docRef, newCart);
        break;
      default:
        console.error(error);
        break;
    }
  });
};

// 아이템 제거
const removeCartItem = async ({
  uid,
  productId,
}: {
  uid: string;
  productId: string;
}) => {
  // 삭제 함수를 삭제할 아이템에 할당
  const newCart: any = { [`cart.${productId}`]: deleteField() };

  // 장바구니 아이템 삭제
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, newCart).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};

// 카트 비우기
const clearCart = async (uid: string) => {
  const docRef = doc(db, "users", uid);

  await updateDoc(docRef, { cart: deleteField() }).catch((error) => {
    console.error(error);
  });
};
