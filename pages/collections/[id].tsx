import { MouseEvent, useEffect, useState } from "react";
import { CollectionType } from "../../types";
import Image from "next/image";
import useLineBreaker from "../../hooks/useLineBreaker";
import useGetCollectionProducts from "../../hooks/useGetProductsById";
import HeaderBasic from "../../components/HeaderBasic";
import ProductList from "../../components/ProductList";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../fb";
import Seo from "../../components/Seo";
import useGetUserData from "../../hooks/useGetUserData";
import useIsAdmin from "../../hooks/useIsAdmin";
import Button from "../../components/Button";
import useCollection from "../../hooks/useCollection";
import { useRouter } from "next/router";

const Collection = (collectionData: CollectionType) => {
  const {
    reload,
    query: { id },
  } = useRouter();
  const lineBreaker = useLineBreaker();
  const [productsIdList, setProductsIdList] = useState<Array<string>>([]);
  const [collection, setCollection] = useState<CollectionType | null>(null);
  const { data: userData } = useGetUserData();
  const isAdmin = useIsAdmin(userData);
  const {
    deleteCollection: { mutateAsync: deleteCollection },
  } = useCollection();

  useEffect(() => {
    if (!collectionData) return;

    if (Object.keys(collectionData).length === 0) return;

    setCollection(collectionData);
  }, [collectionData]);

  const { data: productsList, isFetching } =
    useGetCollectionProducts(productsIdList);

  // 해당하는 컬렉션의 제품 리스트를 상태로 저장
  useEffect(() => {
    if (!collection) return;

    setProductsIdList(collection.products);
  }, [collection]);

  const onDeleteCollection = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!userData && !isAdmin) {
      window.alert("권한이 없습니다.");
      return;
    }

    window.confirm("컬렉션을 삭제하시겠습니까?") &&
      deleteCollection(id as string)
        .catch((error) => {
          console.error(error);
          window.alert(
            "컬렉션 삭제 과정에서 문제가 발생하였습니다.\n잠시 후 다시 시도해 주세요."
          );
        })
        .then(() => {
          window.alert("컬렉션이 삭제되었습니다.");
          reload();
        });
  };

  return (
    <main className="page-container">
      <Seo
        title={collectionData?.enTitle?.toUpperCase()}
        description={`지금 RAEBEF에서 ${collectionData?.title}을 확인해보세요.`}
        url={process.env.NEXT_PUBLIC_ABSOLUTE_URL + "/collections/" + id}
        img={collectionData?.img?.src}
      />
      <HeaderBasic
        title={{
          text:
            collectionData && collectionData?.title
              ? collectionData?.title
              : "존재하지 않는 컬렉션입니다.",
        }}
      />
      {isAdmin && collection && (
        <div className="flex flex-col gap-2 border rounded-lg p-2 text-center m-12 xs:m-5">
          <h4 className="basis-full font-semibold text-lg text-center">
            관리자 메뉴
          </h4>
          <p className="text-sm text-zinc-500">
            컬렉션 ID
            <br />
            {collection.id}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button
              tailwindStyles="text-xs px-2 py-1"
              theme="black"
              href={`/admin/collection/edit/${id}`}
            >
              컬렉션 수정
            </Button>
            <Button
              onClick={onDeleteCollection}
              tailwindStyles="text-xs px-2 py-1"
              theme="red"
            >
              제품 삭제
            </Button>
          </div>
        </div>
      )}
      <article className="px-12 text-zinc-800 xs:px-5">
        <div className="relative w-full aspect-video">
          {collection && (
            <Image src={collection.img.src} alt={collection.title} fill />
          )}
        </div>
        <p className="py-12 font-medium text-base whitespace-pre-line">
          {lineBreaker(collection?.description as string)}
        </p>
        {collection && (
          <ProductList products={productsList || []} isFetching={isFetching} />
        )}
      </article>
    </main>
  );
};

export default Collection;

export async function getServerSideProps({ query }: any) {
  const id = query.id;

  if (!id) return { props: {} };

  const docRef = doc(db, "collections", id);
  const docSnap = await getDoc(docRef);

  return { props: (docSnap.data() as CollectionType) || {} };
}
