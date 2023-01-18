import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../fb";
import { ImageType, ProductType } from "../types";

const addProduct = async ({
  product,
  files,
}: {
  product: ProductType;
  files: { thumbnail: FileList; detailImgs: FileList };
}) => {
  const thumbnail: ImageType = { src: "", id: files.thumbnail[0].name };
  const detailImgs: Array<ImageType> = [];

  // 대표 사진
  const imgStorageRef = ref(storage, `products/${product.id}/${thumbnail.id}`);

  await uploadBytes(imgStorageRef, files.thumbnail[0]);

  thumbnail.src = await getDownloadURL(imgStorageRef);

  // 상세 사진
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
  }

  const finalProduct = { ...product, thumbnail, detailImgs };

  await setDoc(doc(db, "products", product.id), finalProduct);
};

const useAddProduct = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation("products", addProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
    },
    retry: false,
  });

  return mutation;
};

export default useAddProduct;
