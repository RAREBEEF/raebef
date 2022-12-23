import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../fb";
import { ProductType } from "../../types";

const getCollectionProducts = async (idList: Array<string>) => {
  if (idList?.length === 0) return;

  const q = query(collection(db, "products"), where("id", "in", idList));
  const products: Array<ProductType> = [];
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const product = doc.data() as ProductType;
    products.push(product);
  });

  return products;
};

export default getCollectionProducts;
