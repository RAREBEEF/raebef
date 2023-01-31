import { useQueryClient, useMutation } from "react-query";
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../fb";

const useBookmark = () => {
  const queryClient = useQueryClient();

  const add = useMutation("user", addBookmark, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  const remove = useMutation("user", removeBookmark, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  return { add, remove };
};

export default useBookmark;

const addBookmark = async ({
  uid,
  productId,
}: {
  uid: string;
  productId: string;
}) => {
  // 찜목록 업데이트
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    bookmark: arrayUnion(productId),
  }).catch((error) => {
    switch (error.code) {
      // 찜목록 필드가 없을 경우 새로 추가
      case "not-found":
        setDoc(docRef, {
          bookmark: arrayUnion(productId),
        });
        break;
      default:
        console.error(error);
        break;
    }
  });
};

const removeBookmark = async ({
  uid,
  productId,
}: {
  uid: string;
  productId: string;
}) => {
  // 찜목록 업데이트
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    bookmark: arrayRemove(productId),
  }).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};
