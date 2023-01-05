import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import googleLogin from "../pages/api/googleLogin";

const useGoogleLogin = (errorHandler: Function, onSuccess: Function) => {
  const queryClient = useQueryClient();

  const mutation = useMutation("user", googleLogin, {
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

export default useGoogleLogin;
