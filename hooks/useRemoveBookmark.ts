import { useQueryClient, useMutation } from "react-query";
import removeBookmark from "../pages/api/removeBookmark";

const useRemoveBookmark = (errorHandler: Function) => {
  const queryClient = useQueryClient();
  const mutation = useMutation("user", removeBookmark, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    onError: () => errorHandler(),
  });

  return mutation;
};

export default useRemoveBookmark;
