import { useQuery } from "react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../fb";
import { UserData } from "../types";

/**
 * 유저 데이터를 불러온다.
 * @returns query
 * */
const useGetUserData = () => {
  const query = useQuery("user", getUserData, {
    refetchOnWindowFocus: false,
    retry: false,
    cacheTime: 300000,
  });

  return query;
};

export default useGetUserData;

export const getUserData = async (): Promise<UserData | null> => {
  if (typeof window === "undefined") return null;

  // 로컬 스토리지에서 user 데이터 불러오기
  // _app.tsx에서 인증 상태 변화를 감시하고 데이터를 로컬 스토리지에 업로드한다.
  const item = localStorage.getItem("user");

  if (!item) return null;

  const authData = JSON.parse(item);

  if (!authData.uid) return null;

  const docRef = doc(db, "users", authData.uid);
  const docSnap = await getDoc(docRef);

  return { ...(docSnap.data() as UserData), user: authData };
};
