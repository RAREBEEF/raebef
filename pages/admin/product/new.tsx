import HeaderBasic from "../../../components/HeaderBasic";
import FormProduct from "../../../components/FormProduct";
import useIsAdmin from "../../../hooks/useIsAdmin";
import { useRouter } from "next/router";
import useGetUserData from "../../../hooks/useGetUserData";
import { useEffect } from "react";
import Loading from "../../../components/AnimtaionLoading";
import Seo from "../../../components/Seo";

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
      <Seo title="ADD PRODUCT" />
      <HeaderBasic
        parent={{ text: "관리 메뉴", href: "/admin" }}
        title={{ text: "제품 추가" }}
      />
      {isAdmin ? (
        <FormProduct />
      ) : (
        <div className="grow flex justify-center items-center">
          <Loading />
        </div>
      )}
    </main>
  );
};

export default New;
