import { doc, setDoc } from "firebase/firestore";
import { db } from "../../fb";

const addUserData = async (uid: string) => {
  await setDoc(doc(db, "users", uid), {
    bookmark: [],
    cart: [],
    order: [],
  });
};

export default addUserData;
