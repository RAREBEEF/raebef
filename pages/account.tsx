import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AccountBookmark from "../components/AccountBookmark";
import AccountOrders from "../components/AccountOrders";
import AccountProfile from "../components/AccountProfile";
import Loading from "../components/AnimtaionLoading";
import HeaderAccountPage from "../components/HeaderAccountPage";
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
    <main className="page-container">
      <Head>
        <title>RAEBEF │ ACCOUNT</title>
      </Head>
      <HeaderAccountPage tab={tab} />
      {userData ? (
        <div className="px-12 xs:px-5">
          {tab === "profile" && <AccountProfile />}
          {tab === "bookmark" && <AccountBookmark />}
          {tab === "orders" && <AccountOrders />}
        </div>
      ) : (
        <Loading show={true} />
      )}
    </main>
  );
};

export default Account;
