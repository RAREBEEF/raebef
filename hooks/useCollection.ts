import { useMutation, useQueryClient } from "react-query";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../fb";
import { CollectionType, ImageType } from "../types";
import axios from "axios";

/**
 * 컬렉션의 추가/업데이트/제거
 * @returns set, deleteCollection
 * */
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

/**
 * 컬렉션 추가/업데이트
 * @param collection 컬렉션 데이터
 * @param file 컬렉션 썸네일 이미지
 * @param isEdit 신규/업데이트 구분
 */
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

  // 이미지 파일 존재 시
  // 이미지 업로드 및 접근 링크 불러오기
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
    await setDoc(doc(db, "collections", collection.id), finalCollection).then(
      () => revalidate(collection.id)
    );
  } else {
    // 수정
    await updateDoc(
      doc(db, "collections", collection.id),
      finalCollection
    ).then(() => revalidate(collection.id));
  }
};

/**
 * 컬렉션 제거
 * @param collectionId 컬렉션 아이디
 */
const deleteCollectionFn = async (collectionId: string) => {
  if (!collectionId) return;

  const docRef = doc(db, "collections", collectionId);

  await deleteDoc(docRef)
    .catch((error) => {
      switch (error.code) {
        default:
          console.error(error);
          break;
      }
    })
    .then(() => revalidate(collectionId));
};

/**
 * 정적 페이지 업데이트
 * */ 
const revalidate = async (id: string) => {
  await axios.request({
    method: "POST",
    url:
      process.env.NEXT_PUBLIC_ABSOLUTE_URL +
      "/api/revalidate?secret=" +
      process.env.NEXT_PUBLIC_REVALIDATE_TOKEN,
    headers: {
      "Content-Type": "application/json",
    },
    data: { target: "collection", id },
  });
};
