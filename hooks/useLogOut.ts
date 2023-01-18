import { useMutation, useQueryClient } from "react-query";
import { auth } from "../fb";

const logOut = async () => {
  await auth.signOut();

  auth.signOut();
  sessionStorage.removeItem("user");
};

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
