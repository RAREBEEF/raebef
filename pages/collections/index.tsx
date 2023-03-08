import CollectionSectionThumbnail from "../../components/CollectionSectionThumbnail";
import HeaderBasic from "../../components/HeaderBasic";
import useGetCollections from "../../hooks/useGetCollections";
import { CollectionType } from "../../types";
import Seo from "../../components/Seo";

const CollectionList = () => {
  const { data: collections, isError } = useGetCollections();

  return (
    <main className="page-container">
      <Seo
        title="COLLECTIONS"
        description="RAEBEF의 최신 컬렉션을 확인해보세요."
        url={process.env.NEXT_PUBLIC_ABSOLUTE_URL + "/collections"}
      />
      <HeaderBasic title={{ text: "컬렉션 목록" }} />
      <section className="px-12 pb-24 xs:px-5">
        {!isError ? (
          <ul>
            {collections &&
              (collections as Array<CollectionType>).map(
                (collection: CollectionType, i) => (
                  <CollectionSectionThumbnail collection={collection} key={i} />
                )
              )}
          </ul>
        ) : (
          <p className="group relative aspect-video w-full break-keep text-lg font-semibold text-zinc-600">
            컬렉션 데이터를 불러오는 과정에서 문제가 발생하였습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
        )}
      </section>
    </main>
  );
};

export default CollectionList;
