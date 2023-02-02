const useIsAdmin = (uid: string | undefined) =>
  uid ? uid === process.env.NEXT_PUBLIC_ADMIN_UID : false;

export default useIsAdmin;
