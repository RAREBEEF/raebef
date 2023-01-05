const useEmailValidCheck = () => {
  const emailValidCheck = (email: string) => {
    return /^.+@.+\..+$/gi.test(email);
  };
  return emailValidCheck;
};
export default useEmailValidCheck;
