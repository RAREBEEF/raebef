import { useMutation, useQueryClient } from "react-query";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../fb";

function useDeleteProduct() {
  const queryClient = useQueryClient();

  const mutation = useMutation("order", deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
  });

  return mutation;
}

export default useDeleteProduct;

// 제품 데이터 제거
const deleteProduct = async (productId: string) => {
  if (!productId) return;

  const docRef = doc(db, "products", productId);

  await deleteDoc(docRef).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};
