import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useBookmark from "./useBookmark";
import useGetUserData from "./useGetUserData";

/**
 * 북마크 토글 및 북마크 포함 여부 등 해당 제품에 대한 북마크 기능 전반을 담당
 * @param productId 북마크를 제어할 대상 제품 id
 * @returns toggleBookmark, isInBookmark
 * */
const useToggleBookmark = (productId: string) => {
  const router = useRouter();
  const { data: userData } = useGetUserData();
  const [isInBookmark, setIsInBookmark] = useState<boolean>(false);
  const { add: addBookmark, remove: removeBookmark } = useBookmark();

  // 북마크를 토글한다.
  const toggleBookmark = () => {
    if (!userData) {
      router.push({
        pathname: "/login",
        query: { from: `/products/product/${productId}` },
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

  // 북마크 포함 여부를 업데이트한다.
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
