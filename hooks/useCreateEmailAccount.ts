import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import createEmailAccount from "../pages/api/createEmailAccount";

const useCreateEmailAccount = (errorHandler: Function, onSuccess: Function) => {
  const queryClient = useQueryClient();

  const mutaion = useMutation("user", createEmailAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      onSuccess();
    },
    retry: false,
  });

  useEffect(() => {
    if (mutaion.isError) errorHandler(mutaion.error);
  }, [errorHandler, mutaion.error, mutaion.isError]);

  return mutaion;
};

export default useCreateEmailAccount;
