import { useEffect, useState } from "react";
import { ProductType, StockType } from "../types";

const useIsSoldOut = (stock: StockType | undefined) => {
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);

  useEffect(() => {
    if (!stock) return;

    if (Object.values(stock).some((stock) => stock >= 1)) {
      setIsSoldOut(false);
    } else {
      setIsSoldOut(true);
    }
  }, [stock]);

  return isSoldOut;
};

export default useIsSoldOut;
