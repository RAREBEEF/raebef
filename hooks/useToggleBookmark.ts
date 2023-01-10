import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import useBookmark from "./useBookmark";
import useGetUserData from "./useGetUserData";

const useToggleBookmark = (productId: string) => {
  const router = useRouter();
  const { data: userData } = useGetUserData();
  const [isInBookmark, setIsInBookmark] = useState<boolean>(false);

  const bookmarkErrorHandler = () => {
    window.alert(
      "북마크 추가/제거 중 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
    );
  };

  const { add: addBookmark, remove: removeBookmark } =
    useBookmark(bookmarkErrorHandler);

  const toggleBookmark = () => {
    if (!userData) {
      router.push({
        pathname: "/login",
        query: { from: `/products/${productId}` },
      });
    } else if (isInBookmark) {
      removeBookmark.mutate({
        uid: userData?.user?.uid as string,
        productId: productId,
      });
    } else {
      addBookmark.mutate({
        uid: userData?.user?.uid as string,
        productId: productId,
      });
    }
  };

  useEffect(() => {
    if (userData?.bookmark?.includes(productId)) {
      setIsInBookmark(true);
    } else {
      setIsInBookmark(false);
    }
  }, [productId, userData?.bookmark]);

  return { toggleBookmark, isInBookmark };
};

export default useToggleBookmark;
