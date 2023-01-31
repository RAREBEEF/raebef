import { useQuery } from "react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../fb";
import { UserData } from "../types";

const useGetUserData = () => {
  const query = useQuery("user", getUserData, {
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useGetUserData;

const getUserData = async (): Promise<UserData | null> => {
  if (typeof window === "undefined") return null;

  const item = localStorage.getItem("user");

  if (!item) return null;

  const authData = JSON.parse(item);

  if (!authData.uid) return null;

  const docRef = doc(db, "users", authData.uid);
  const docSnap = await getDoc(docRef);

  return { ...(docSnap.data() as UserData), user: authData };
};
