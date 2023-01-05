import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../fb";

const googleLogin = async () => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider).then((userCredential) => {
    return userCredential.user;
  });
};

export default googleLogin;
