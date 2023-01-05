import { useRouter } from "next/router";
import React, { MouseEvent, useEffect } from "react";
import Button from "../components/Button";
import useGetUserData from "../hooks/useGetUserData";
import useLogOut from "../hooks/useLogOut";

const Account = () => {
  const { replace } = useRouter();
  const { data, isFetched } = useGetUserData();

  useEffect(() => {
    if (isFetched && !data) replace("/login");
  }, [replace, isFetched, data]);

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
      {data && (
        <main className="page-container">
          Account
          <Button onClick={onLogOut}>로그아웃</Button>
        </main>
      )}
    </React.Fragment>
  );
};

export default Account;
