import { FirebaseError } from "firebase/app";
import { useEffect } from "react";
import { useQuery } from "react-query";
import getCollections from "../pages/api/getCollections";
import { CollectionType } from "../types";

const useGetCollections = (errorHandler: Function) => {
  const query = useQuery<any, FirebaseError, Array<CollectionType>>(
    "collections",
    getCollections
  );
  useEffect(() => {
    if (query.isError) errorHandler();
  }, [errorHandler, query, query.isError]);

  return query;
};

export default useGetCollections;
