import { useMutation, useQueryClient } from "react-query";
import logOut from "../pages/api/logOut";

const useLogOut = (onSuccess: Function) => {
  const queryClient = useQueryClient();

  const mutation = useMutation("user", logOut, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      onSuccess();
    },
  });

  return mutation;
};

export default useLogOut;
