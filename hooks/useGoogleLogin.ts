import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../fb";

const googleLogin = async () => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider).then((userCredential) => {
    return userCredential.user;
  });
};

const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation("user", googleLogin, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    retry: false,
  });

  return mutation;
};

export default useGoogleLogin;
