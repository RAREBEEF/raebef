import { useMutation, useQueryClient } from "react-query";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../fb";
import { ImageType, ProductType } from "../types";

const useProduct = () => {
  const queryClient = useQueryClient();

  const set = useMutation(setProduct, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [
          "productsByFilter",
          "productsCountByFilter",
          "productsById",
          "productsFromCart",
        ],
      }),
    retry: false,
  });

  const deleteProduct = useMutation(deleteProductFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [
          "productsByFilter",
          "productsCountByFilter",
          "productsById",
          "productsFromCart",
        ],
      }),
    retry: false,
  });

  return { deleteProduct, set };
};

export default useProduct;

const setProduct = async ({
  product,
  files,
  isEdit = false,
}: {
  product: ProductType;
  files: { thumbnail: FileList | null; detailImgs: FileList | null };
  isEdit?: boolean;
}) => {
  const finalProduct = { ...product };
  let thumbnail: ImageType;
  const detailImgs: Array<ImageType> = [];

  // 대표 사진이 변경된 경우
  if (files.thumbnail) {
    thumbnail = { src: "", id: files.thumbnail[0].name };

    const imgStorageRef = ref(
      storage,
      `products/${product.id}/${thumbnail.id}`
    );

    await uploadBytes(imgStorageRef, files.thumbnail[0]);

    thumbnail.src = await getDownloadURL(imgStorageRef);

    finalProduct.thumbnail = thumbnail;
  }

  // 상세 사진이 변경된 경우
  if (files.detailImgs) {
    for (let i in Object.keys(files.detailImgs)) {
      const newDetailImg = { src: "", id: "" };

      newDetailImg.id = files.detailImgs[i].name;

      const imgStorageRef = ref(
        storage,
        `products/${product.id}/${newDetailImg.id}`
      );

      await uploadBytes(imgStorageRef, files.detailImgs[i]);

      newDetailImg.src = await getDownloadURL(imgStorageRef);

      detailImgs.push(newDetailImg);

      finalProduct.detailImgs = detailImgs;
    }
  }

  if (!isEdit) {
    // 업로드
    await setDoc(doc(db, "products", product.id), finalProduct);
  } else {
    // 수정
    await updateDoc(doc(db, "products", product.id), finalProduct);
  }
};

// 제품 데이터 제거
const deleteProductFn = async (productId: string) => {
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
