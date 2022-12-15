import CollectionSection from "../components/CollectionSection";
import CategoryShortcutSection from "../components/CategoryShortcutSection";
import useGetCollections from "../hooks/useGetCollections";
import { useRouter } from "next/router";

const Home = () => {
  const { back } = useRouter();

  const errorHandler = () => {
    window?.alert(
      "컬렉션을 불러오는 과정에서 문제가 발생 하였습니다.\n잠시 후 다시 시도해 주세요."
    );

    back();
  };

  const { data: collections } = useGetCollections(errorHandler);

  return (
    <div className="page-container">
      {collections?.map((collection, i) => {
        return <CollectionSection collection={collection} key={i} />;
      })}
      <CategoryShortcutSection />
    </div>
  );
};

export default Home;
