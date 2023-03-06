import { MouseEvent, useEffect, useState } from "react";
import { CollectionType } from "../../types";
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
  const { data: productsList, isFetching } =
    useGetCollectionProducts(productsIdList);

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

  // serverSide에서 불러온 컬렉션을 체크하고 상태에 저장
  useEffect(() => {
    if (!collectionData || Object.keys(collectionData).length === 0) return;

    setCollection(collectionData);
  }, [collectionData]);

  // 컬렉션의 제품 리스트를 상태로 저장
  useEffect(() => {
    if (!collection) return;

    setProductsIdList(collection.products);
  }, [collection]);

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
      <section className="px-12 pb-24 xs:px-5">
        <article className="text-zinc-800 ">
          {collection && (
            <div className="relative mx-[-1px] aspect-auto max-h-[300px] overflow-hidden xl:max-h-[450px]">
              <video
                poster={collection.img.src}
                className="h-full w-full translate-y-[-30%] transition-transform duration-500 group-hover:scale-110 lg:translate-y-0"
                playsInline
                autoPlay
                loop
                muted
              >
                <source
                  src={`/videos/${collection.id}.mov`}
                  type="video/mp4"
                ></source>
              </video>
            </div>
          )}
          <p className="whitespace-pre-line break-keep py-24 text-center text-base font-medium italic">
            {lineBreaker(collection?.description as string)}
          </p>
          {collection && (
            <ProductList
              products={productsList || []}
              isFetching={isFetching}
            />
          )}
        </article>
        {isAdmin && collection && (
          <div className="mt-24 flex flex-col gap-2 rounded-lg border bg-white p-2 text-center">
            <h4 className="basis-full text-center text-lg font-semibold">
              관리자 메뉴
            </h4>
            <p className="text-sm text-zinc-500">
              컬렉션 ID
              <br />
              {collection.id}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
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
                컬렉션 삭제
              </Button>
            </div>
          </div>
        )}
      </section>
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
