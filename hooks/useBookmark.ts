import { useQueryClient, useMutation } from "react-query";
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../fb";
import { UserData } from "../types";

/**
 * 북마크 추가/제거 훅, 버튼의 빠른 반응을 위해 낙관적 업데이트가 적용되어 있다.
 * @returns add, remove
 * */
const useBookmark = () => {
  const queryClient = useQueryClient();

  const add = useMutation(addBookmark, {
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchInactive: true,
      }),
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const prevData: UserData | undefined = queryClient.getQueryData(["user"]);
      const newData = {
        ...prevData,
        bookmark: prevData?.bookmark
          ? [...prevData?.bookmark, productId]
          : [productId],
      };
      queryClient.setQueryData(["user"], () => newData);

      return { prevData };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData("user", context?.prevData);
    },
  });

  const remove = useMutation(removeBookmark, {
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchInactive: true,
      }),
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const prevData: UserData | undefined = queryClient.getQueryData(["user"]);
      const newData = {
        ...prevData,
        bookmark: prevData?.bookmark?.filter((id) => id !== productId),
      };
      queryClient.setQueryData(["user"], () => newData);

      return { prevData };
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData("user", context?.prevData);
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
  // 북마크 업데이트
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    bookmark: arrayUnion(productId),
  }).catch((error) => {
    switch (error.code) {
      // 북마크 필드가 없을 경우 새로 추가
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
  // 북마크 업데이트
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
