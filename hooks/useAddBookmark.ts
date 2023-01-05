import { useQueryClient, useMutation } from "react-query";
import addBookmark from "../pages/api/addBookmark";

const useAddBookmark = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation("user", addBookmark, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  return mutation;
};

export default useAddBookmark;
