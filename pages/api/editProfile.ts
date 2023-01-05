import { auth } from "../../fb";
import { updateProfile } from "firebase/auth";

const editProfile = async ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  const user = auth.currentUser;

  if (!user) return;

  await updateProfile(user, {
    displayName: lastName + firstName,
  });
};

export default editProfile;
