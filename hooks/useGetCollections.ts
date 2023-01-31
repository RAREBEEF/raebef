import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { CollectionType } from "../types";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../fb";

const useGetCollections = () => {
  const query = useQuery<any, FirebaseError, Array<CollectionType>>(
    "collections",
    getCollections,
    { refetchOnWindowFocus: false }
  );

  return query;
};

export default useGetCollections;

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
