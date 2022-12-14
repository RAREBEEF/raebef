import React from "react";
import CollectionSectionSlide from "./CollectionSectionSlide";
import CollectionSectionPhoto from "./CollectionSectionPhoto";
import HomeSectionHeader from "./HomeSectionHeader";
import useGetCollections from "../hooks/useGetCollections";
import Loading from "./Loading";

const Collections = () => {
  const { data: collections, isError, isFetching } = useGetCollections();

  return (
    <ul className="relative">
      {isFetching ? (
        <div className="relative w-full aspect-video">
          <Loading />
        </div>
      ) : !isError ? (
        collections?.map((collection, i) => {
          return (
            <section key={i}>
              <CollectionSectionPhoto collection={collection} />
              <div className="my-2 overflow-hidden">
                <HomeSectionHeader
                  text={collection.title}
                  href={`/collection/${collection.id}`}
                />
                <CollectionSectionSlide
                  productIdList={collection.products.slice(0, 10)}
                />
              </div>
            </section>
          );
        })
      ) : (
        <p className="group relative w-full aspect-video text-zinc-600 font-semibold text-lg break-keep">
          컬렉션 데이터를 불러오는 과정에서 문제가 발생하였습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
      )}
    </ul>
  );
};

export default Collections;
