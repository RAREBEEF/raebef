import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "react-query";
import { auth, db } from "../fb";
import { AddressType } from "../types";

const useAccount = () => {
  const queryClient = useQueryClient();

  const editProfile = useMutation("user", editProfileFn, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  const createEmailAccount = useMutation("user", createEmailAccountFn, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    retry: false,
  });

  const authErrorAlert = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found" || "auth/wrong-password":
        return "이메일 혹은 비밀번호가 일치하지 않습니다.";
      case "auth/email-already-in-use":
        return "이미 사용 중인 이메일입니다.";
      case "auth/weak-password":
        return "비밀번호는 6글자 이상이어야 합니다.";
      case "auth/network-request-failed":
        return "네트워크 연결에 실패하였습니다.";
      case "auth/invalid-email":
        return "잘못된 이메일 형식입니다.";
      case "auth/internal-error":
        return "잘못된 요청입니다.";
      default:
        return "로그인에 실패하였습니다.";
    }
  };

  const emailValidCheck = (email: string) => {
    return /^.+@.+\..+$/gi.test(email);
  };

  const login = useMutation("user", loginFn, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    retry: false,
  });

  const logout = useMutation("user", logoutFn, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  return {
    login,
    logout,
    editProfile,
    authErrorAlert,
    createEmailAccount,
    emailValidCheck,
  };
};

export default useAccount;

const logoutFn = async () => {
  await auth.signOut();

  auth.signOut();
  sessionStorage.removeItem("user");
};

const loginFn = async ({
  provider,
  email,
  password,
}: {
  provider: "email" | "google";
  email?: string;
  password?: string;
}) => {
  switch (provider) {
    case "email":
      if (!email || !password) break;
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          return userCredential.user;
        }
      );
      break;

    case "google":
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider).then((userCredential) => {
        return userCredential.user;
      });
      break;

    default:
      break;
  }
};

const createEmailAccountFn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

const editProfileFn = async ({
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
