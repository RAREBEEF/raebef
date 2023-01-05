import Link from "next/link";

const Footer = () => {
  return (
    <footer className="min-w-[360px] h-fit mt-20 flex flex-col justify-center items-center gap-y-5 text-zinc-800 border-t-2 border-zinc-300">
      <section className="w-[90%] flex gap-10 py-10">
        <div>
          <h3 className="font-semibold text-lg mb-2">문의</h3>
          <ul className="flex flex-col pl-2">
            <li>
              <Link
                href="mailto:drrobot409@gmail.com?subject=[Raebef 문의] - "
                className="underline"
              >
                drrobot409@gmail.com
              </Link>
            </li>
            <li>
              <Link href="https://rarebeef.co.kr" className="underline">
                rarebeef.co.kr
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">법적 고지 및 이용약관</h3>
          <ul className="flex flex-col pl-2">
            <li>
              <Link href="/legal-notice" className="underline">
                이용 약관
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="underline">
                개인정보 처리 방침
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="w-full text-xs px-5 py-5 border-t">
        <div className="flex gap-x-2 flex-wrap whitespace-nowrap">
          <span>Raebef</span>
          <span>대표자 : 송의영</span>
          <span>주소 : 대한민국</span>
          <span className="whitespace-pre-wrap break-keep">
            본 웹사이트는 실제가 아닌 개인 학습용으로 제작된 웹사이트이며 어떠한
            수익 창출도 이루어지지 않습니다.
          </span>
        </div>
        <div className="mt-1">
          &copy; {new Date().getFullYear()}. RAREBEEF All Rights Reserved.
        </div>
      </section>
    </footer>
  );
};

export default Footer;
