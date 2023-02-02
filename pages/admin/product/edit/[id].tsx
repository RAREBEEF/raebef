import HeaderBasic from "../../../../components/HeaderBasic";
import FormProduct from "../../../../components/FormProduct";
import useGetProductsById from "../../../../hooks/useGetProductsById";
import { useRouter } from "next/router";
import useGetUserData from "../../../../hooks/useGetUserData";
import useIsAdmin from "../../../../hooks/useIsAdmin";
import { useEffect } from "react";
import Loading from "../../../../components/AnimtaionLoading";

const Edit = () => {
  const { query, replace } = useRouter();
  const { data: productData } = useGetProductsById((query.id as string) || "");
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
        title={{ text: "제품 수정" }}
      />
      {isAdmin ? (
        <FormProduct prevData={productData} />
      ) : (
        <Loading show={!isAdmin} />
      )}
    </main>
  );
};

export default Edit;
