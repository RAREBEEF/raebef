import { useMutation, useQueryClient } from "react-query";
import editProfile from "../pages/api/editProfile";

const useEditProfile = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation("user", editProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  return mutation;
};

export default useEditProfile;
