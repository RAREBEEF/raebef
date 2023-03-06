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
  const { data: userData, isFetched } = useGetUserData();
  const isAdmin = useIsAdmin(userData);

  useEffect(() => {
    if (userData && !isAdmin) {
      window.alert("권한이 없습니다.");
      replace("/", undefined, { shallow: true });
    }
  }, [isAdmin, replace, userData]);

  useEffect(() => {
    if (isFetched && !userData) {
      replace(
        {
          pathname: "/login",
          query: {
            from: "/admin",
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [isFetched, replace, userData]);

  return (
    <main className="page-container flex flex-col">
      <Seo title="ADMIN" />
      <HeaderBasic title={{ text: "관리자 메뉴" }} />
      {isAdmin ? (
        <section className="flex pb-24 flex-col gap-12">
          <ul className="flex flex-col gap-12 px-12 xs:px-5">
            <li>
              <Link
                href={{
                  pathname: `/admin/dashboard`,
                }}
              >
                <h3 className="text-2xl font-bold text-zinc-800">대시보드</h3>
              </Link>
            </li>{" "}
            <li>
              <h3 className="text-2xl font-bold text-zinc-800">제품 관리</h3>
              <ul className="mt-5 flex flex-wrap gap-5 pl-5 text-xl font-semibold text-zinc-500">
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
              <h3 className="text-2xl font-bold text-zinc-800">컬렉션 관리</h3>
              <ul className="mt-5 flex flex-wrap gap-5 pl-5 text-xl font-semibold text-zinc-500">
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
              <h3 className="text-2xl font-bold text-zinc-800">주문 관리</h3>
              <ul className="mt-5 flex flex-wrap gap-5 pl-5 text-xl font-semibold text-zinc-500">
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
        <div className="flex grow items-center justify-center">
          <Loading />
        </div>
      )}
    </main>
  );
};

export default Index;
