import { arrayRemove, deleteField, doc, updateDoc } from "firebase/firestore";
import { db } from "../../fb";

const removeCartItem = async ({
  uid,
  productId,
}: {
  uid: string;
  productId: string;
}) => {
  // 삭제 함수를 삭제할 아이템에 할당
  const dotNotation = `cart.${productId}`;
  const newCart: any = {};
  newCart[dotNotation as string] = deleteField();

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

export default removeCartItem;
