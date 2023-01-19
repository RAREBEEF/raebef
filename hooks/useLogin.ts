import { useMutation, useQueryClient } from "react-query";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../fb";

const login = async ({
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
      console.log("하지만 구글로 로그인");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider).then((userCredential) => {
        return userCredential.user;
      });
      break;

    default:
      break;
  }
};

const useLogin = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation("user", login, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    retry: false,
  });

  return mutation;
};

export default useLogin;
