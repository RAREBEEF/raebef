import { useRouter } from "next/router";
import useGetProduct from "../../hooks/useGetProduct";
import { ProductType } from "../../types";

const Product = () => {
  const {
    query: { id },
    back,
  } = useRouter();

  const errorHandler = () => {
    window.alert(
      "제품을 불러오는 과정에서 문제가 발생 하였습니다.\n잠시 후 다시 시도해 주세요."
    );

    back();
  };

  const { data: product } = useGetProduct(id as string, errorHandler);

  console.log(product);
  return <div className="page-container"></div>;
};

export default Product;
