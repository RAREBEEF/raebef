import {
  collection,
  getDocs,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { db } from "../../fb";
import { ProductListType, ProductType } from "../../types";

const getCartProducts = async (idList: Array<string> | null) => {
  if (!idList || idList.length === 0) return;

  const products: ProductListType = {};

  const q = query(collection(db, "products"), where("id", "in", idList));

  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    products[doc.id] = doc.data() as ProductType;
  });

  return products;
};

export default getCartProducts;
