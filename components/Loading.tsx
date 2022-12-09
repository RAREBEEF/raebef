import { useIsFetching } from "react-query";

const Loading = () => {
  const isFetching = useIsFetching();
  return isFetching ? (
    <div className="fixed top-0 z-50 h-screen w-screen bg-black"></div>
  ) : null;
};

export default Loading;
