import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { auth, db } from "../fb";
import { AddressType } from "../types";

/**
 * 로그인, 로그아웃, 정보 수정 등 계정에 관련된 기능
 * @returns deleteAccount, login, logout, editProfile, authErrorAlert, createEmailAccount, emailValidCheck, changePw
 */
const useAccount = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const editProfile = useMutation(editProfileFn, {
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchInactive: true,
      }),
    retry: false,
  });

  const createEmailAccount = useMutation("user", createEmailAccountFn, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
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

  const login = useMutation(loginFn, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    retry: false,
  });

  const logout = useMutation(logoutFn, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    retry: false,
  });

  const deleteAccount = useMutation(deleteAccountFn, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.alert("탈퇴가 완료되었습니다.");
      push("/");
    },
  });

  const changePw = async (email?: string) => {
    const sendTo = email || auth.currentUser?.email;

    if (!sendTo) return;

    sendPasswordResetEmail(auth, sendTo).catch((error) => {
      console.error(error);
      window.alert(
        "재설정 메일 발송 중 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
      );
    });
  };

  return {
    deleteAccount,
    login,
    logout,
    editProfile,
    authErrorAlert,
    createEmailAccount,
    emailValidCheck,
    changePw,
  };
};

export default useAccount;

const deleteAccountFn = async (uid: string | undefined) => {
  if (!uid) return;

  const docRef = doc(db, "users", uid);

  await auth.currentUser?.delete().catch((error) => {
    console.error(error);
  });

  await deleteDoc(docRef).catch((error) => {
    console.error(error);
  });
};

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
  // 전달한 provider에 따라 이메일 로그인과 구글 팝업 로그인 분기
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
