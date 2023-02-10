import { useMutation, useQueryClient } from "react-query";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../fb";
import { CollectionType, ImageType } from "../types";

const useCollection = () => {
  const queryClient = useQueryClient();

  const set = useMutation(setCollection, {
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["collections"] }),
    retry: false,
  });

  const deleteCollection = useMutation(deleteCollectionFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["collectionss"] }),
    retry: false,
  });

  return { deleteCollection, set };
};

export default useCollection;

const setCollection = async ({
  collection,
  file,
  isEdit = false,
}: {
  collection: CollectionType;
  file: FileList | null;
  isEdit?: boolean;
}) => {
  const finalCollection = { ...collection };
  let poster: ImageType;

  // 포스터가 변경된 경우
  if (file) {
    poster = { src: "", id: file[0].name };

    const imgStorageRef = ref(
      storage,
      `collections/${collection.id}/${poster.id}`
    );

    await uploadBytes(imgStorageRef, file[0]);

    poster.src = await getDownloadURL(imgStorageRef);

    finalCollection.img = poster;
  }

  if (!isEdit) {
    // 업로드
    await setDoc(doc(db, "collections", collection.id), finalCollection);
  } else {
    // 수정
    await updateDoc(doc(db, "collections", collection.id), finalCollection);
  }
};

// 데이터 제거
const deleteCollectionFn = async (collectionId: string) => {
  if (!collectionId) return;

  const docRef = doc(db, "collections", collectionId);

  await deleteDoc(docRef).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};
