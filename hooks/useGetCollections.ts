import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { CollectionType } from "../types";
import { collection, query, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../fb";

/**
 * 해당 id의 컬렉션 데이터를 불러온다.
 * @param id 컬렉션 id
 * @returns query
 * */
const useGetCollections = (id?: string, enable: boolean = true) => {
  const query = useQuery<
    any,
    FirebaseError,
    Array<CollectionType> | CollectionType
  >(["collections", id], () => getCollections(id), {
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 300000,
    staleTime: 300000,
    enabled: enable,
  });

  return query;
};

export default useGetCollections;

const getCollections = async (id: string | undefined) => {
  const collections: Array<CollectionType> = [];

  if (id) {
    const docRef = doc(db, "collections", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as CollectionType;
  } else {
    const q = query(collection(db, "collections"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const collection = doc.data() as CollectionType;
      collections.push(collection);
    });

    return collections;
  }
};
