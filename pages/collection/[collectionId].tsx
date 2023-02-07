import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CollectionType } from "../../types";
import Image from "next/image";
import useLineBreaker from "../../hooks/useLineBreaker";
import useGetCollectionProducts from "../../hooks/useGetProductsById";
import useGetCollections from "../../hooks/useGetCollections";
import HeaderBasic from "../../components/HeaderBasic";
import ProductList from "../../components/ProductList";
import Head from "next/head";

const Collection = () => {
  const lineBreaker = useLineBreaker();
  const { query } = useRouter();
  const [collection, setCollection] = useState<CollectionType>();
  const [productsIdList, setProductsIdList] = useState<Array<string>>([]);

  const { data: collections } = useGetCollections();
  const { data: productsList, isFetching } =
    useGetCollectionProducts(productsIdList);

  // 컬헥션 목록에서 해당하는 컬렉션을 찾아 상태로 저장
  useEffect(() => {
    if (!collections) return;
    for (let i in collections) {
      if (collections[i]?.id === query.collectionId) {
        setCollection(collections[i]);
        return;
      }
    }
  }, [query, collections]);

  // 해당하는 컬렉션의 제품 리스트를 상태로 저장
  useEffect(() => {
    if (!collection) return;

    setProductsIdList(collection.products);
  }, [collection]);

  return (
    <main className="page-container">
      <Head>
        <title>RAEBEF │ {collection?.enTitle.toUpperCase()}</title>
        <meta
          name="description"
          content={`지금 RAEBEF에서 ${collection?.title}을 확인해보세요.`}
        />
        <meta
          property="og:title"
          content={`RAEBEF │ ${collection?.enTitle.toUpperCase()}`}
        />
        <meta
          property="og:url"
          content={
            process.env.NEXT_PUBLIC_ABSOLUTE_URL +
            "/collection/" +
            collection?.id
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={collection?.img.src} />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`RAEBEF │ ${collection?.enTitle.toUpperCase()}`}
        />
        <meta
          name="twitter:description"
          content={`지금 RAEBEF에서 ${collection?.title}을 확인해보세요.`}
        />
        <meta name="twitter:image" content={collection?.img.src} />
      </Head>
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
        <p className="py-12 font-medium text-base whitespace-pre-line">
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
