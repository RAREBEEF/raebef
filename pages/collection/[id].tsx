import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductList from "../../components/ProductList";
import { CollectionType, ProductType } from "../../types";
import collectionsData from "../../collectionsDummy.json";
import productsData from "../../productsDummy.json";
import Image from "next/image";

const Collection = () => {
  const router = useRouter();
  const [collection, setCollection] = useState<CollectionType>();
  const [products, setProducts] = useState<Array<ProductType>>([]);

  useEffect(() => {
    for (let i in collectionsData) {
      if (collectionsData[i].id === router.query.id) {
        setCollection(collectionsData[i]);
        return;
      }
    }
  }, [collection, router.query.id]);

  useEffect(() => {
    if (!collection) return;
    const productsList: Array<ProductType> = [];

    collection.items.map((id) => {
      for (let i in productsData) {
        if (productsData[i].id === id) {
          productsList.push(productsData[i]);
          return;
        }
      }
    });

    setProducts(productsList);
  }, [collection]);

  return (
    <article className="page-container px-12 text-zinc-800">
      <h1 className="pt-10 font-bold text-5xl">{collection?.title}</h1>
      <p className="pt-10 font-medium text-base">{collection?.description}</p>
      <ProductList products={products}>
        <div className="relative w-[44%] aspect-video lg:w-[74%] md:w-[84%] xs:w-[84%] 2xs:w-[100%]">
          <Image
            src={!collection ? "" : collection.img.src}
            alt={!collection ? "" : collection?.title}
            fill
            objectFit="contain"
          />
        </div>
      </ProductList>
    </article>
  );
};

export default Collection;
