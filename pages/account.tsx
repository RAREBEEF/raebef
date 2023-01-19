import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AccountBookmark from "../components/AccountBookmark";
import AccountProfile from "../components/AccountProfile";
import HeaderAccountPage from "../components/HeaderAccountPage";
import useGetUserData from "../hooks/useGetUserData";

const Account = () => {
  const { replace, query } = useRouter();
  const [tab, setTab] = useState<string>("");
  const { data: userData, isFetched } = useGetUserData();

  useEffect(() => {
    if (isFetched && !userData)
      replace({
        pathname: "/login",
        query: {
          from: "/account?profile",
        },
      });
  }, [replace, isFetched, userData]);

  useEffect(() => {
    setTab(query.tab as string);
  }, [query.tab]);

  return (
    <main className="page-container">
      <HeaderAccountPage tab={tab} />
      {userData && (
        <div className="px-12 xs:px-5">
          {tab === "profile" && <AccountProfile />}
          {tab === "bookmark" && <AccountBookmark />}
        </div>
      )}
    </main>
  );
};

export default Account;
