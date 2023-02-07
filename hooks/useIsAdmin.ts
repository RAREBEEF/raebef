import { UserData } from "../types";

const useIsAdmin = (userData: UserData | undefined | null) =>
  userData ? userData.isAdmin === true : false;

export default useIsAdmin;
