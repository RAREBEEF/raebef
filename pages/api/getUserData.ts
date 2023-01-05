import { doc, getDoc } from "firebase/firestore";
import { db } from "../../fb";
import { UserData } from "../../types";

const getUserData = async (): Promise<UserData | null> => {
  if (typeof window === "undefined") return null;

  const item = sessionStorage.getItem("user");

  if (!item) return null;

  const authData = JSON.parse(item);

  if (!authData.uid) return null;

  const docRef = doc(db, "users", authData.uid);
  const docSnap = await getDoc(docRef);

  return { ...(docSnap.data() as UserData), user: authData };
};

export default getUserData;
