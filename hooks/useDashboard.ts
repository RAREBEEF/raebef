import { FirebaseError } from "firebase/app";
import { useQuery } from "react-query";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../fb";
import { DashboardDataType } from "../types";

const useDashboard = () => {
  const query = useQuery<{ [key in string]: DashboardDataType }, FirebaseError>(
    {
      queryKey: ["orders"],
      queryFn: () => getDatas(),
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 300000,
      staleTime: 300000,
    }
  );

  return query;
};

export default useDashboard;

// 데이터 불러오기
const getDatas = async () => {
  const result: { [key in string]: DashboardDataType } = {};

  const q = query(collection(db, "dashboard"));

  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    result[doc.id] = doc.data() as DashboardDataType;
  });

  return result;
};
