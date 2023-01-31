import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../fb";

const useCreateEmailAccount = () => {
  const queryClient = useQueryClient();

  const mutaion = useMutation("user", createEmailAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    retry: false,
  });

  return mutaion;
};

export default useCreateEmailAccount;

const createEmailAccount = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await createUserWithEmailAndPassword(auth, email, password);
};
