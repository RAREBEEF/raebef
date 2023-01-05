import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../fb";

const createEmailAccount = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

export default createEmailAccount;
