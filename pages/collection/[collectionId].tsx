import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductList from "../../components/ProductList";
import { CollectionType } from "../../types";
import Image from "next/image";
import getCollections from "../api/getCollections";
import { useQueries } from "react-query";
import getCollectionProducts from "../api/getCollectionProducts";
import useLineBreaker from "../../hooks/useLineBreaker";

const Collection = () => {
  const lineBreaker = useLineBreaker();
  const { collectionId } = useRouter().query;
  const [collection, setCollection] = useState<CollectionType>();
  const [productsIdList, setProductsIdList] = useState<Array<string>>([]);
  const [collections, products] = useQueries([
    {
      queryKey: "collections",
      queryFn: getCollections,
    },
    {
      queryKey: ["collectionProducts", productsIdList],
      queryFn: () => getCollectionProducts(productsIdList),
      enabled: productsIdList.length !== 0,
    },
  ]);

  // 해당하는 컬렉션을 상태로 저장
  useEffect(() => {
    if (!collections.data) return;
    for (let i in collections.data) {
      if (collections.data[i]?.id === collectionId) {
        setCollection(collections.data[i]);
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
    <article className="page-container px-12 text-zinc-800">
      <h1 className="pt-10 font-bold text-5xl">{collection?.title}</h1>
      <p className="pt-10 font-medium text-base whitespace-pre-line">
        {lineBreaker(collection?.description)}
      </p>
      <ProductList products={products.data}>
        <div className="relative w-[44%] aspect-video lg:w-[74%] md:w-[84%] xs:w-[84%] 2xs:w-[100%]">
          {!!collection && (
            <Image
              src={collection.img.src}
              alt={collection.title}
              fill
              priority
            />
          )}
        </div>
      </ProductList>
    </article>
  );
};

export default Collection;
