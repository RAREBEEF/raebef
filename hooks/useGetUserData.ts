import { useQuery } from "react-query";
import getUserData from "../pages/api/getUserData";

const useGetUserData = () => {
  const query = useQuery("user", getUserData, {
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useGetUserData;
