import Link from "next/link";

const LayoutFooter = () => {
  return (
    <footer className="relative min-w-[360px] max-w-[1300px] h-fit mt-12 mx-auto flex flex-col justify-center items-center gap-y-5 text-zinc-800 border-t-2 border-zinc-300">
      <section className="w-full flex flex-wrap justify-start gap-10 p-5">
        <div>
          <h3 className="font-bold text-xs mb-2">제품 둘러보기</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/collection">컬렉션</Link>
            </li>
            <li>
              <Link href="/products/categories/all">모든 제품</Link>
            </li>
            <li>
              <Link href="/products/categories/clothes/all">의류</Link>
            </li>
            <li>
              <Link href="/products/categories/accessory/all">악세서리</Link>
            </li>
            <li>
              <Link href="/products/categories/shoes/all">신발</Link>
            </li>
            <li>
              <Link href="/products/categories/bag/all">가방</Link>
            </li>
            <li>
              <Link href="/products/categories/jewel/all">주얼리</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-xs mb-2">계정</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/account?tab=profile">내 정보</Link>
            </li>
            <li>
              <Link href="/account?tab=bookmark">북마크</Link>
            </li>
            <li>
              <Link href="/account?tab=orders">주문 내역</Link>
            </li>
            <li>
              <Link href="/cart">카트</Link>
            </li>
            <li>
              <Link href="/login">로그인</Link>
            </li>
            <li>
              <Link href="/register">회원가입</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xs mb-2">문의</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="mailto:drrobot409@gmail.com?subject=[Raebef 문의] - ">
                메일
              </Link>
            </li>
            <li>
              <Link href="https://rarebeef.co.kr">개발자 홈페이지</Link>
            </li>
            <li>
              <Link href="https://velog.io/@drrobot409">개발자 블로그</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-xs mb-2">법적 고지 및 이용약관</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/legal-notice">이용 약관</Link>
            </li>
            <li>
              <Link href="/privacy-policy">개인정보 처리 방침</Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="w-full text-xs px-5 py-5 border-t">
        <p>
          회사명: Raebef. 대표자: 송의영. 주소: 대한민국. 이메일:{" "}
          <Link
            href="mailto:drrobot409@gmail.com?subject=[Raebef 문의] - "
            className="underline"
          >
            drrobot409@gmail.com.
          </Link>{" "}
          홈페이지:{" "}
          <Link href="/privacy-policy" className="underline">
            rarebeef.co.kr.
          </Link>{" "}
          <Link href="/legal-notice" className="underline">
            이용 약관.
          </Link>{" "}
          <Link href="/privacy-policy" className="underline">
            개인정보 처리 방침.
          </Link>{" "}
          본 웹사이트는 실제가 아닌 개인 학습용으로 제작된 웹사이트이며 등록된
          제품은 실제 판매되는 제품이 아닙니다. &copy;{" "}
          {new Date().getFullYear()}. RAREBEEF All Rights Reserved.
        </p>
      </section>
    </footer>
  );
};

export default LayoutFooter;
