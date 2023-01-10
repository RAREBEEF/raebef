import { useQueryClient, useMutation, useQuery } from "react-query";
import addBookmark from "../pages/api/addBookmark";
import removeBookmark from "../pages/api/removeBookmark";

const useBookmark = (errorHandler: Function) => {
  const queryClient = useQueryClient();

  const add = useMutation("user", addBookmark, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    onError: () => errorHandler(),
  });

  const remove = useMutation("user", removeBookmark, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
    onError: () => errorHandler(),
  });

  return { add, remove };
};

export default useBookmark;
