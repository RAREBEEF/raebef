import { auth } from "../../fb";

const logOut = async () => {
  await auth.signOut();

  auth.signOut();
  sessionStorage.removeItem("user");
};

export default logOut;
