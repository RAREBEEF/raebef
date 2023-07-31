import Link from "next/link";
import categoryData from "../public/json/categoryData.json";

const LayoutFooter = () => {
  return (
    <footer className="relative mx-auto flex h-fit min-w-[360px] flex-col items-center justify-center gap-y-5 bg-zinc-50 py-12 text-zinc-500">
      <ul className="flex w-full max-w-[1700px] flex-wrap justify-start gap-12 p-5 pt-0">
        <li>
          <h3 className="mb-5 font-bold">제품 둘러보기</h3>
          <ul className="flex flex-col gap-2">
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="/collections">컬렉션</Link>
            </li>
            {Object.values(categoryData).map((category, i) => (
              <li
                key={i}
                className="transition-all hover:font-semibold hover:text-zinc-800"
              >
                <Link
                  href={`/products/categories/${category.path}${
                    category.path !== "all" && "/all"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <h3 className="mb-5 font-bold">계정</h3>
          <ul className="flex flex-col gap-2">
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="/account?tab=profile">내 정보</Link>
            </li>
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="/account?tab=bookmark">북마크</Link>
            </li>
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="/account?tab=orders">주문 내역</Link>
            </li>
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="/cart">카트</Link>
            </li>
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="/login">로그인</Link>
            </li>
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="/register">회원가입</Link>
            </li>
          </ul>
        </li>

        <li>
          <h3 className="mb-5 font-bold">문의</h3>
          <ul className="flex flex-col gap-2">
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="mailto:drrobot409@gmail.com?subject=[Raebef 문의] - ">
                메일
              </Link>
            </li>
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="https://rarebeef.co.kr">개발자 홈페이지</Link>
            </li>
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="https://velog.io/@drrobot409">개발자 블로그</Link>
            </li>
          </ul>
        </li>
        <li>
          <h3 className="mb-5 font-bold">법적 고지 및 이용약관</h3>
          <ul className="flex flex-col gap-2">
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="/legal-notice">이용 약관</Link>
            </li>
            <li className="transition-all hover:font-semibold hover:text-zinc-800">
              <Link href="/privacy-policy">개인정보 처리 방침</Link>
            </li>
          </ul>
        </li>
        <li>
          <h3 className="font-bold transition-all hover:text-zinc-800">
            <Link href="/sitemap">사이트맵</Link>
          </h3>
        </li>
      </ul>

      <section className="w-full max-w-[1700px] p-5 pb-0 pr-24 text-xs">
        <h3 className="mb-2 text-xs font-bold">RAEBEF</h3>
        <p className="max-w-[600px]">
          회사명: Raebef / 대표자: 송의영 / 주소: 대한민국 / 이메일:{" "}
          <Link
            href="mailto:drrobot409@gmail.com?subject=[Raebef 문의] - "
            className="underline transition-all hover:text-zinc-800"
          >
            drrobot409@gmail.com
          </Link>
          {" / "}
          홈페이지:{" "}
          <Link
            href="/privacy-policy"
            className="underline transition-all hover:text-zinc-800"
          >
            rarebeef.co.kr
          </Link>
          {" / "}
          <Link
            href="/legal-notice"
            className="underline transition-all hover:text-zinc-800"
          >
            이용 약관
          </Link>
          {" / "}
          <Link
            href="/privacy-policy"
            className="underline transition-all hover:text-zinc-800"
          >
            개인정보 처리 방침
          </Link>
          {" / "}본 웹사이트는 실제가 아닌 개인 학습용으로 제작된 웹사이트이며
          등록된 제품은 본 웹사이트에서 판매되는 제품이 아닙니다. / &copy;{" "}
          {new Date().getFullYear()}. RAREBEEF All Rights Reserved.
        </p>
      </section>
    </footer>
  );
};

export default LayoutFooter;
