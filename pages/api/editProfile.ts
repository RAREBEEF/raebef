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

  const newProfile = { ...user, displayName: lastName + firstName };

  localStorage.setItem("user", JSON.stringify(newProfile));

  await updateProfile(user, newProfile);
};

export default editProfile;
