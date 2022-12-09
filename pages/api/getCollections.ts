import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../fb";
import { CollectionType } from "../../types";

const getCollections = async () => {
  const q = query(collection(db, "collections"));
  const collections: Array<CollectionType> = [];
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const collection = doc.data() as CollectionType;
    collections.push(collection);
  });

  return collections;
};

export default getCollections;
