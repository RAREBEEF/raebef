import { useRouter } from "next/router";
import HeaderBasic from "../../components/HeaderBasic";
import Seo from "../../components/Seo";

const PurchaseFail = () => {
  const { query } = useRouter();

  return (
    <main className="page-container">
      <Seo title="PURCHASE" />

      <HeaderBasic title={{ text: "결제가 중단되었습니다." }} toHome={true} />
      <section className="px-12 xs:px-5 text-zinc-800">
        <h3 className="font-semibold text-2xl mb-5">
          {query.cause === "timeout"
            ? "요청한 시간이 초과되었습니다."
            : query.cause === "badrequest"
            ? "잘못된 요청입니다."
            : "결제에 실패하였습니다. 잠시 후 다시 시도해주세요"}
        </h3>
        <ul className="flex flex-col gap-3 break-keep">
          <li>
            <h4 className="text-lg font-semibold">왜 결제가 중단되었나요?</h4>
            <p className="indent-1">
              결제 승인에 필요한 필수 정보가 전달되지 않았습니다. 결제 과정에서
              오류가 발생했거나 의도하지 않은 url 접근일 수 있습니다.
            </p>
          </li>
          <li>
            <h4 className="text-lg font-semibold">어떻게 하면 되나요?</h4>
            <p className="indent-1">
              아직 결제가 이루어지지 않은 단계이므로 안심하셔도 괜찮습니다.
              중단된 결제를 다시 진행하시거나
            </p>
          </li>
        </ul>
      </section>
    </main>
  );
};

export default PurchaseFail;
