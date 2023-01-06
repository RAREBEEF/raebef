import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import getCollections from "../pages/api/getCollections";
import { CollectionType } from "../types";

const useGetCollections = () => {
  const query = useQuery<any, FirebaseError, Array<CollectionType>>(
    "collections",
    getCollections,
    { refetchOnWindowFocus: false }
  );

  return query;
};

export default useGetCollections;
