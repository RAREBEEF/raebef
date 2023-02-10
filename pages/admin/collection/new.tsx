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
  const { data: userData } = useGetUserData();
  const isAdmin = useIsAdmin(userData);

  useEffect(() => {
    if (userData && !isAdmin) {
      window.alert("권한이 없습니다.");
      replace("/", undefined, { shallow: true });
    }
  }, [isAdmin, replace, userData]);

  return (
    <main className="page-container">
      <Seo title="ADD COLLECTION" />

      <HeaderBasic
        parent={{ text: "컬렉션 관리", href: "/admin/collection" }}
        title={{ text: "컬렉션 추가" }}
      />
      {isAdmin ? <FormCollection /> : <Loading />}
    </main>
  );
};

export default New;
