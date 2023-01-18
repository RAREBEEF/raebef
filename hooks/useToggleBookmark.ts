import { useRouter } from "next/router";
import { MouseEvent, useEffect, useState } from "react";
import useBookmark from "./useBookmark";
import useGetUserData from "./useGetUserData";

const useToggleBookmark = (productId: string) => {
  const router = useRouter();
  const { data: userData } = useGetUserData();
  const [isInBookmark, setIsInBookmark] = useState<boolean>(false);
  const { add: addBookmark, remove: removeBookmark } = useBookmark();

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
