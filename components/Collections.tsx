import CollectionSectionSlide from "./CollectionSectionSlide";
import CollectionSectionThumbnail from "./CollectionSectionThumbnail";
import HeaderHomeSection from "./HeaderHomeSection";
import useGetCollections from "../hooks/useGetCollections";
import Loading from "./AnimtaionLoading";
import { CollectionType } from "../types";

const Collections = () => {
  const { data: collections, isError, isFetching } = useGetCollections();

  return (
    <section className="relative">
      {isFetching ? (
        <div>
          <div className="relative flex w-full flex-col gap-24">
            <div className="relative mb-5 max-h-[300px] xl:max-h-[450px]">
              <Loading />
            </div>
            <CollectionSectionSlide productIdList={[]} />
          </div>
          <div className="relative flex w-full flex-col gap-24">
            <div className="relative mb-5 max-h-[300px] xl:max-h-[450px]">
              <Loading />
            </div>
            <CollectionSectionSlide productIdList={[]} />
          </div>
        </div>
      ) : !isError ? (
        (collections as Array<CollectionType>)?.map((collection, i) => {
          return (
            <div key={i}>
              <CollectionSectionThumbnail collection={collection} />
              <div className="my-5 overflow-hidden">
                <HeaderHomeSection
                  text={collection.title}
                  href={`/collections/${collection.id}?inapp=true`}
                />
                <CollectionSectionSlide
                  productIdList={collection.products.slice(0, 10)}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p className="group relative aspect-video w-full break-keep text-lg font-semibold text-zinc-600">
          컬렉션 데이터를 불러오는 과정에서 문제가 발생하였습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
      )}
    </section>
  );
};

export default Collections;
