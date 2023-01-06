import { useQueryClient, useMutation } from "react-query";
import addBookmark from "../pages/api/addBookmark";

const useAddBookmark = (errorHandler: Function) => {
  const queryClient = useQueryClient();
  const mutation = useMutation("user", addBookmark, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    onError: () => errorHandler(),
  });

  return mutation;
};

export default useAddBookmark;
