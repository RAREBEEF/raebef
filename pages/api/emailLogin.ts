import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../fb";

const emailLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await signInWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      return userCredential.user;
    }
  );
};

export default emailLogin;
