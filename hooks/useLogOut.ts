import { useMutation, useQueryClient } from "react-query";
import { auth } from "../fb";

const useLogOut = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation("user", logOut, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  return mutation;
};

export default useLogOut;

const logOut = async () => {
  await auth.signOut();

  auth.signOut();
  sessionStorage.removeItem("user");
};
