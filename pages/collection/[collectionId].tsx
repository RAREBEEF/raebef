import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CollectionType } from "../../types";
import Image from "next/image";
import useLineBreaker from "../../hooks/useLineBreaker";
import useGetCollectionProducts from "../../hooks/useGetCollectionProducts";
import useGetCollections from "../../hooks/useGetCollections";
import HeaderBasic from "../../components/HeaderBasic";
import ProductList from "../../components/ProductList";

const Collection = () => {
  const lineBreaker = useLineBreaker();
  const { collectionId } = useRouter().query;
  const [collection, setCollection] = useState<CollectionType>();
  const [productsIdList, setProductsIdList] = useState<Array<string>>([]);

  const { data: collections } = useGetCollections();
  const { data: productsList, isFetching } =
    useGetCollectionProducts(productsIdList);

  // 컬헥션 목록에서 해당하는 컬렉션을 찾아 상태로 저장
  useEffect(() => {
    if (!collections) return;
    for (let i in collections) {
      if (collections[i]?.id === collectionId) {
        setCollection(collections[i]);
        return;
      }
    }
  }, [collectionId, collections]);

  // 해당하는 컬렉션의 제품 리스트를 상태로 저장
  useEffect(() => {
    if (!collection) return;

    setProductsIdList(collection.products);
  }, [collection]);

  return (
    <main className="page-container">
      <HeaderBasic
        parent={{ text: "컬렉션", href: "/collection" }}
        title={{
          text: collection?.title || "",
          href: `/collection/${collection?.id}`,
        }}
      />
      <article className="px-12 text-zinc-800">
        <div className="relative w-full aspect-video">
          {!!collection && (
            <Image src={collection.img.src} alt={collection.title} fill />
          )}
        </div>
        <p className="pt-12 font-medium text-base whitespace-pre-line">
          {lineBreaker(collection?.description as string)}
        </p>
        {productsList && (
          <ProductList products={productsList} isFetching={isFetching} />
        )}
      </article>
    </main>
  );
};

export default Collection;
