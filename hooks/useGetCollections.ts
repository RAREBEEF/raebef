import { useEffect } from "react";
import { useQuery } from "react-query";
import getCollections from "../pages/api/getCollections";

const useGetCollections = (errorHandler: Function) => {
  const query = useQuery("collections", getCollections);

  useEffect(() => {
    if (query.isError) errorHandler();
  }, [errorHandler, query, query.isError]);

  return query;
};

export default useGetCollections;
