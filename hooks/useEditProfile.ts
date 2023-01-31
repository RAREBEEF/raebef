import { useMutation, useQueryClient } from "react-query";
import { auth, db } from "../fb";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { AddressType } from "../types";

const useEditProfile = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation("user", editProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  return mutation;
};

export default useEditProfile;

const editProfile = async ({
  name,
  addressData = null,
  phoneNumber = null,
}: {
  name: string;
  addressData?: AddressType | null;
  phoneNumber?: string | null;
}) => {
  const user = auth.currentUser;

  if (!user) return;

  const newName = { ...user, displayName: name };
  const docRef = doc(db, "users", user.uid);

  // 이름 수정
  localStorage.setItem("user", JSON.stringify(newName));
  await updateProfile(user, newName);

  // 주소, 전화번호 수정
  await updateDoc(docRef, {
    addressData,
    phoneNumber,
  }).catch((error) => {
    switch (error.code) {
      // 필드가 없을 경우 새로 추가
      case "not-found":
        setDoc(docRef, {
          addressData,
          phoneNumber,
        });
        break;
      default:
        console.error(error);
        break;
    }
  });
};
