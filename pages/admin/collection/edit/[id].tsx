import HeaderBasic from "../../../../components/HeaderBasic";
import FormProduct from "../../../../components/FormProduct";
import useGetProductsById from "../../../../hooks/useGetProductsById";
import { useRouter } from "next/router";
import useGetUserData from "../../../../hooks/useGetUserData";
import useIsAdmin from "../../../../hooks/useIsAdmin";
import { useEffect } from "react";
import Loading from "../../../../components/AnimtaionLoading";
import Seo from "../../../../components/Seo";
import useGetCollections from "../../../../hooks/useGetCollections";
import FormCollection from "../../../../components/FormCollection";

const Edit = () => {
  const { query, replace } = useRouter();
  const { data: collectionData } = useGetCollections(
    (query.id as string) || ""
  );
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
      <Seo title="EDIT COLLECTION" />
      <HeaderBasic
        parent={{ text: "컬렉션 관리", href: "/admin/collection" }}
        title={{ text: "컬렉션 수정" }}
      />
      {isAdmin ? (
        <FormCollection prevData={collectionData && collectionData[0]} />
      ) : (
        <Loading show={!isAdmin} />
      )}
    </main>
  );
};

export default Edit;
