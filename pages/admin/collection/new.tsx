import HeaderBasic from "../../../components/HeaderBasic";
import useIsAdmin from "../../../hooks/useIsAdmin";
import { useRouter } from "next/router";
import useGetUserData from "../../../hooks/useGetUserData";
import { useEffect } from "react";
import Loading from "../../../components/AnimtaionLoading";
import Seo from "../../../components/Seo";
import FormCollection from "../../../components/FormCollection";

const New = () => {
  const { replace } = useRouter();
  const { data: userData, isFetched } = useGetUserData();
  const isAdmin = useIsAdmin(userData);

  useEffect(() => {
    if (userData && !isAdmin) {
      window.alert("권한이 없습니다.");
      replace("/", undefined, { shallow: true });
    }
  }, [isAdmin, replace, userData]);

  useEffect(() => {
    if (isFetched && !userData) {
      replace(
        {
          pathname: "/login",
          query: {
            from: "/admin",
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [isFetched, replace, userData]);

  return (
    <main className="page-container flex flex-col">
      <Seo title="ADD COLLECTION" />
      <HeaderBasic title={{ text: "컬렉션 추가" }} />
      {isAdmin ? (
        <FormCollection />
      ) : (
        <div className="grow flex justify-center items-center">
          <Loading />
        </div>
      )}
    </main>
  );
};

export default New;
