import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import AccountBookmark from "../components/AccountBookmark";
import AccountOrders from "../components/AccountOrders";
import AccountProfile from "../components/AccountProfile";
import Loading from "../components/AnimtaionLoading";
import HeaderAccountPage from "../components/HeaderAccountPage";
import Seo from "../components/Seo";
import useGetUserData from "../hooks/useGetUserData";

const Account = () => {
  const { replace, query } = useRouter();
  const [tab, setTab] = useState<string>("profile");
  const { data: userData, isFetched } = useGetUserData();

  useEffect(() => {
    if (isFetched && !userData) {
      replace(
        {
          pathname: "/login",
          query: {
            from: "/account?tab=profile",
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [replace, isFetched, userData]);

  useEffect(() => {
    if (!query.tab) return;
    setTab(query.tab as string);
  }, [query.tab]);

  return (
    <main className="page-container flex flex-col">
      <Seo title="ACCOUNT" />

      {userData ? (
        <Fragment>
          <HeaderAccountPage tab={tab} />
          <div className="px-12 xs:px-5">
            {tab === "profile" && <AccountProfile userData={userData} />}
            {tab === "bookmark" && <AccountBookmark userData={userData} />}
            {tab === "orders" && <AccountOrders userData={userData} />}
          </div>
        </Fragment>
      ) : (
        <div className="grow flex justify-center items-center">
          <Loading show={true} />
        </div>
      )}
    </main>
  );
};

export default Account;
