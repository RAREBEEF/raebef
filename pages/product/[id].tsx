import { useRouter } from "next/router";

const Item = () => {
  const router = useRouter();
  return <div className="page-container">{router.query.id}</div>;
};

export default Item;
