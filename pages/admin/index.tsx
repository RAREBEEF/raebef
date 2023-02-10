import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "../../components/AnimtaionLoading";
import HeaderBasic from "../../components/HeaderBasic";
import Seo from "../../components/Seo";
import useGetUserData from "../../hooks/useGetUserData";
import useIsAdmin from "../../hooks/useIsAdmin";

const Index = () => {
  const { replace } = useRouter();
  const { data: userData } = useGetUserData();
  const isAdmin = useIsAdmin(userData);

  useEffect(() => {
    if (userData && !isAdmin) {
      window.alert("권한이 없습니다.");
      replace("/", undefined, { shallow: true });
    }
  }, [isAdmin, replace, userData]);

  return (
    <main className="page-container">
      <Seo title="ADMIN" />
      <HeaderBasic title={{ text: "목록" }} parent={{ text: "관리 메뉴" }} />
      {isAdmin ? (
        <section>
          <ul className="flex flex-col px-12 gap-12 xs:px-5">
            <li>
              <h3 className="text-zinc-800 text-2xl font-bold">제품 관리</h3>
              <ul className="flex flex-wrap gap-5 pl-5 mt-5 text-zinc-500 text-xl font-semibold">
                <li>
                  <Link
                    href={{
                      pathname: `/admin/product/new`,
                    }}
                  >
                    제품 추가
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <h3 className="text-zinc-800 text-2xl font-bold">컬렉션 관리</h3>
              <ul className="flex flex-wrap gap-5 pl-5 mt-5 text-zinc-500 text-xl font-semibold">
                <li>
                  <Link
                    href={{
                      pathname: `/admin/collection/new`,
                    }}
                  >
                    컬렉션 추가
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <h3 className="text-zinc-800 text-2xl font-bold">주문 관리</h3>
              <ul className="flex flex-wrap gap-5 pl-5 mt-5 text-zinc-500 text-xl font-semibold">
                <li>
                  <Link
                    href={{
                      pathname: `/admin/orders`,
                    }}
                  >
                    주문 목록
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      ) : (
        <Loading />
      )}
    </main>
  );
};

export default Index;
