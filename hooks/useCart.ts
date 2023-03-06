import { useQueryClient, useMutation } from "react-query";
import { deleteField, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../fb";
import { CartType, StockType, UserData } from "../types";

/**
 * 카트 추가/제거/비우기 훅, 빠른 반응을 위해 제거에 낙관적 업데이트가 적용되어 있다.
 * @returns add, remove, clear
 * */
const useCart = () => {
  const queryClient = useQueryClient();

  const add = useMutation(addCartItem, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchInactive: true,
      }),
  });

  const remove = useMutation(removeCartItem, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchInactive: true,
      }),
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const prevData: UserData | undefined = queryClient.getQueryData(["user"]);
      const newData = {
        ...prevData,
      };

      if (!newData || !newData.cart) {
        return prevData;
      } else {
        delete newData.cart[productId];
        if (Object.keys(newData.cart).length === 0) {
          newData.cart = null;
        }
        queryClient.setQueryData(["user"], () => newData);
      }
    },
  });

  const clear = useMutation(clearCart, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchInactive: true,
      }),
  });

  return { add, remove, clear };
};

export default useCart;

const addCartItem = async ({
  uid,
  productId,
  options,
}: {
  uid: string;
  productId: string;
  options: StockType;
}) => {
  const newCart: CartType = { [`cart.${productId}`]: options };

  // 카트 업데이트
  const docRef = doc(db, "users", uid);

  await updateDoc(docRef, newCart).catch((error) => {
    switch (error.code) {
      // 카트 필드가 없을 경우 새로 추가
      case "not-found":
        setDoc(docRef, newCart);
        break;
      default:
        console.error(error);
        break;
    }
  });
};

const removeCartItem = async ({
  uid,
  productId,
}: {
  uid: string;
  productId: string;
}) => {
  const newCart: any = { [`cart.${productId}`]: deleteField() };

  // 카트 업데이트
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, newCart).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};

const clearCart = async (uid: string) => {
  const docRef = doc(db, "users", uid);

  await updateDoc(docRef, { cart: deleteField() }).catch((error) => {
    console.error(error);
  });
};
