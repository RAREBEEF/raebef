import HeaderBasic from "../../../components/HeaderBasic";
import FormProduct from "../../../components/FormProduct";
import useIsAdmin from "../../../hooks/useIsAdmin";
import { useRouter } from "next/router";
import useGetUserData from "../../../hooks/useGetUserData";
import { useEffect } from "react";
import Loading from "../../../components/AnimtaionLoading";

const New = () => {
  const { replace } = useRouter();
  const { data: userData } = useGetUserData();
  const isAdmin = useIsAdmin(userData?.user?.uid);

  useEffect(() => {
    if (userData && !isAdmin) {
      window.alert("권한이 없습니다.");
      replace("/", undefined, { shallow: true });
    }
  }, [isAdmin, replace, userData]);

  return (
    <main className="page-container">
      <HeaderBasic
        parent={{ text: "제품 관리", href: "/admin/product" }}
        title={{ text: "제품 추가" }}
      />
      {isAdmin ? <FormProduct /> : <Loading />}
    </main>
  );
};

export default New;
