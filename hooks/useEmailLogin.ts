import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import emailLogin from "../pages/api/emailLogin";

const useEmailLogin = (errorHandler: Function, onSuccess: Function) => {
  const queryClient = useQueryClient();
  const mutation = useMutation("user", emailLogin, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      onSuccess();
    },
    retry: false,
  });

  useEffect(() => {
    if (mutation.isError) errorHandler(mutation.error);
  }, [errorHandler, mutation.error, mutation.isError]);

  return mutation;
};

export default useEmailLogin;
