import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import CollectionSectionPhoto from "../../components/CollectionSectionPhoto";
import PageHeader from "../../components/PageHeader";
import useGetCollections from "../../hooks/useGetCollections";
import { CollectionType } from "../../types";

const CollectionList = () => {
  const { back } = useRouter();

  const errorHandler = () => {
    window?.alert(
      "컬렉션을 불러오는 과정에서 문제가 발생 하였습니다.\n잠시 후 다시 시도해 주세요."
    );

    back();
  };

  const { data: collections } = useGetCollections(errorHandler);

  console.log(collections);

  return (
    <div className="page-container">
      <PageHeader
        title={{ text: "컬렉션 목록", href: "/collection" }}
        parent={{ text: "컬렉션", href: "/collection" }}
      />
      <ul className="px-12 xs:px-5">
        {collections &&
          collections.map((collection: CollectionType, i) => (
            <CollectionSectionPhoto collection={collection} key={i} />
          ))}
      </ul>
    </div>
  );
};

export default CollectionList;
