import { doc, getDoc } from "firebase/firestore";
import { db } from "../../fb";
import { ProductType } from "../../types";

const getProduct = async (id: string | undefined) => {
  if (!id) return;

  const docRef = doc(db, "products", id);

  const docSnap = await getDoc(docRef);

  const result = docSnap.data() as ProductType;

  return result;
};

export default getProduct;
