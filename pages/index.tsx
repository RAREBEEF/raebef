import Collections from "../components/Collections";
import Loading from "../components/AnimtaionLoading";
import Modal from "../components/Modal";
import QuickCategory from "../components/QuickCategory";
import useGetUserData from "../hooks/useGetUserData";
import useModal from "../hooks/useModal";
import Done from "../components/AnimationDone";

const Home = () => {
  const { data: userData } = useGetUserData();
  const { triggerModal, showModal } = useModal();
  console.log(userData);

  return (
    <main className="page-container">
      <Collections />
      <QuickCategory />
      <Modal show={showModal}>
        <Done show={showModal} />
      </Modal>
      <button onClick={() => triggerModal(2000)}>모달 출력</button>
    </main>
  );
};

export default Home;
