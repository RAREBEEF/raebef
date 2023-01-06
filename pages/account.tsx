import { useRouter } from "next/router";
import React, { MouseEvent, useEffect } from "react";
import Button from "../components/Button";
import useGetUserData from "../hooks/useGetUserData";
import useLogOut from "../hooks/useLogOut";

const Account = () => {
  const { replace } = useRouter();
  const { data: userData, isFetched } = useGetUserData();

  useEffect(() => {
    if (isFetched && !userData)
      replace({
        pathname: "/login",
        query: {
          from: "/account",
        },
      });
  }, [replace, isFetched, userData]);

  const onLogOutSuccess = () => {
    replace("/login");
  };

  const { mutate: logOut } = useLogOut(onLogOutSuccess);

  const onLogOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    logOut();
  };

  return (
    <React.Fragment>
      {userData && (
        <main className="page-container">
          Account
          <Button onClick={onLogOut}>로그아웃</Button>
        </main>
      )}
    </React.Fragment>
  );
};

export default Account;
