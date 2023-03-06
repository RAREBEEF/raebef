import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import AccountBookmark from "../components/AccountBookmark";
import AccountProfile from "../components/AccountProfile";
import Loading from "../components/AnimtaionLoading";
import HeaderAccountPage from "../components/HeaderAccountPage";
import OrderList from "../components/OrderList";
import Seo from "../components/Seo";
import useGetUserData from "../hooks/useGetUserData";

const Account = () => {
  const { replace, query } = useRouter();
  const [tab, setTab] = useState<string>("profile");
  const [triggerRedirect, setTriggerRedirect] = useState<boolean>(false);
  const { data: userData, isFetched } = useGetUserData();

  useEffect(() => {
    if (isFetched && !userData) {
      setTriggerRedirect(true);
    }
  }, [isFetched, userData]);

  useEffect(() => {
    if (triggerRedirect)
      replace(
        {
          pathname: "/login",
          query: {
            from: `/account?tab=${query.tab}`,
          },
        },
        undefined,
        { shallow: true }
      );
  }, [triggerRedirect, replace, query.tab]);

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
          <div className="px-12 pb-24 xs:px-5">
            {tab === "profile" && <AccountProfile userData={userData} />}
            {tab === "bookmark" && <AccountBookmark userData={userData} />}
            {tab === "orders" && <OrderList userData={userData} />}
          </div>
        </Fragment>
      ) : (
        <div className="flex grow items-center justify-center">
          <Loading show={true} />
        </div>
      )}
    </main>
  );
};

export default Account;
