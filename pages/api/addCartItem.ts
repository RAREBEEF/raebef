import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../fb";
import useGetUserData from "../../hooks/useGetUserData";
import { CartType, SizeType, StockType } from "../../types";

const addCartItem = async ({
  uid,
  productId,
  options,
}: {
  uid: string;
  productId: string;
  options: any;
}) => {
  // 장바구니에 등록할 데이터
  const dotNotation = `cart.${productId}`;
  const newCart: CartType = {};
  newCart[dotNotation] = options;

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

export default addCartItem;
