import { useQueryClient, useMutation } from "react-query";
import removeBookmark from "../pages/api/removeBookmark";

const useRemoveBookmark = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation("user", removeBookmark, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  return mutation;
};

export default useRemoveBookmark;
