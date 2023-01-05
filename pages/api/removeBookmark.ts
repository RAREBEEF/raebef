import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../../fb";

const removeBookmark = async ({
  uid,
  productId,
}: {
  uid: string;
  productId: string;
}) => {
  // 찜목록 업데이트
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    bookmark: arrayRemove(productId),
  }).catch((error) => {
    switch (error.code) {
      default:
        console.error(error);
        break;
    }
  });
};

export default removeBookmark;
