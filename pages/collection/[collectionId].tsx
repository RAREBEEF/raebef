import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductList from "../../components/ProductList";
import { CollectionType } from "../../types";
import Image from "next/image";
import getCollections from "../api/getCollections";
import { useQueries } from "react-query";
import getCollectionProducts from "../api/getCollectionProducts";
import useLineBreaker from "../../hooks/useLineBreaker";
import PageHeader from "../../components/PageHeader";
import useGetCollectionProducts from "../../hooks/useGetCollectionProducts";
import useGetCollections from "../../hooks/useGetCollections";

const Collection = () => {
  const { back } = useRouter();
  const lineBreaker = useLineBreaker();
  const { collectionId } = useRouter().query;
  const [collection, setCollection] = useState<CollectionType>();
  const [productsIdList, setProductsIdList] = useState<Array<string>>([]);

  const errorHandler = () => {
    window?.alert(
      "컬렉션 정보를 불러오는 과정에서 문제가 발생 하였습니다.\n잠시 후 다시 시도해 주세요."
    );

    back();
  };

  const { data: collections } = useGetCollections(errorHandler);
  const { data: productsList } = useGetCollectionProducts(
    productsIdList,
    errorHandler
  );

  // 해당하는 컬렉션을 상태로 저장
  useEffect(() => {
    if (!collections) return;
    for (let i in collections) {
      if (collections[i]?.id === collectionId) {
        setCollection(collections[i]);
        return;
      }
    }
  }, [collectionId, collections]);

  // 컬렉션의 제품 리스트를 상태로 저장
  useEffect(() => {
    if (!collection) return;

    setProductsIdList(collection.products);
  }, [collection]);

  return (
    <div className="page-container">
      <PageHeader
        parent={{ text: "컬렉션", href: "/collection" }}
        title={{
          text: collection?.title || "",
          href: `/collection/${collection?.id}`,
        }}
      />
      <article className="px-12 text-zinc-800">
        <div className="relative w-full aspect-video">
          {!!collection && (
            <Image
              src={collection.img.src}
              alt={collection.title}
              fill
              priority
            />
          )}
        </div>
        <p className="pt-12 font-medium text-base whitespace-pre-line">
          {lineBreaker(collection?.description)}
        </p>
        <ProductList products={productsList}>
          {/* <div className="relative w-[44%] aspect-video lg:w-[74%] md:w-[84%] xs:w-[84%] 2xs:w-[100%]">
            {!!collection && (
              <Image
                src={collection.img.src}
                alt={collection.title}
                fill
                priority
              />
            )}
          </div> */}
        </ProductList>
      </article>
    </div>
  );
};

export default Collection;
