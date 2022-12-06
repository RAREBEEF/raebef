import { useRouter } from "next/router";

const Product = () => {
  const router = useRouter();
  return <div className="page-container">{router.query.id}</div>;
};

export default Product;
