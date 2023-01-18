import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../fb";

const emailLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await signInWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      return userCredential.user;
    }
  );
};

const useEmailLogin = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation("user", emailLogin, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    retry: false,
  });

  return mutation;
};

export default useEmailLogin;
