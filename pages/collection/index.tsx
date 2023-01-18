import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import CollectionSectionPhoto from "../../components/CollectionSectionPhoto";
import HeaderBasic from "../../components/HeaderBasic";
import Loading from "../../components/AnimtaionLoading";
import useGetCollections from "../../hooks/useGetCollections";
import { CollectionType } from "../../types";

const CollectionList = () => {
  const { data: collections, isError } = useGetCollections();

  return (
    <main className="page-container">
      <HeaderBasic
        title={{ text: "컬렉션 목록" }}
        parent={{ text: "컬렉션" }}
      />
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
