import CollectionSectionPhoto from "../../components/CollectionSectionThumbnail";
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
      {!isError ? (
        <ul className="px-12 xs:px-5">
          {collections &&
            collections.map((collection: CollectionType, i) => (
              <CollectionSectionPhoto collection={collection} key={i} />
            ))}
        </ul>
      ) : (
        <p className="group relative w-full aspect-video text-zinc-600 font-semibold text-lg break-keep">
          컬렉션 데이터를 불러오는 과정에서 문제가 발생하였습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
      )}
    </main>
  );
};

export default CollectionList;
