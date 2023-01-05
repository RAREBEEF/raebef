import { useQuery } from "react-query";
import getUserData from "../pages/api/getUserData";

const useGetUserData = () => {
  const query = useQuery("user", getUserData);

  return query;
};

export default useGetUserData;
