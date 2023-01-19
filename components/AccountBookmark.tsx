import useGetProductsById from "../hooks/useGetProductsById";
import { ProductType, UserData } from "../types";
import ProductList from "./ProductList";

interface Props {
  userData: UserData;
}

const AccountBookmark: React.FC<Props> = ({ userData }) => {
  const { data: ProductsData, isFetching } = useGetProductsById(
    userData.bookmark || []
  );

  return (
    <section className="px-5">
      <ProductList
        products={ProductsData as Array<ProductType>}
        isFetching={isFetching}
      />
    </section>
  );
};

export default AccountBookmark;
