import HeaderBasic from "../components/HeaderBasic";
import Seo from "../components/Seo";

const PrivacyPolicy = () => {
  return (
    <main className="page-container">
      <Seo title="PRIVACY POLICY" />

      <HeaderBasic title={{ text: "개인정보 처리 방침" }} />
      <section className="flex flex-col gap-12 whitespace-pre-wrap break-keep px-12 pb-24 indent-2 text-base text-zinc-800 xs:px-5">
        <strong>
          본 사이트는 실제 운영되는 사이트가 아닌 개인 학습용으로 제작된
          웹사이트입니다.
        </strong>
        <strong>
          This is not a actual website. This website was developed for personal
          learning.
        </strong>

        <em className="indent-0">
          사용자는 본 웹사이트를 참고하거나 사용하기 전에 다음 방침을 주의 깊게
          읽어야 합니다.
        </em>
        <ol className="flex flex-col gap-12">
          <li className="flex flex-col gap-5">
            <strong className="indent-0">1. 총칙</strong>
            <div>
              https://raebef.netlify.app/ (이하{" "}
              <strong>&quot;웹사이트&quot;</strong>)는 실제가 아닌 RAREBEEF의
              개인 학습용으로 제작된 웹사이트이며 어떠한 수익 창출도 이루어지지
              않습니다. 본 웹사이트는 Google LLC의 Firebase (이하{" "}
              <strong>&quot;파이어베이스&quot;</strong>)의 서비스를 이용하며
              웹사이트를 운영 및 이용하며 발생되는 개인정보를 포함한 데이터는
              모두 파이어베이스에서 관리됩니다. 웹사이트의 개발자인 RAREBEEF는
              본 웹사이트를 이용할 수 있는 테스트용 아이디와 비밀번호를
              제공합니다. 특별한 이유가 없을 경우 회원가입 대신 테스트용 계정을
              사용할 것을 권장드립니다. 또한 부득이 회원가입이 필요할 경우 실제
              이메일을 입력하지 않아도 별도의 인증 없이 회원가입이 가능합니다.
              <div className="flex flex-col gap-1 p-5 indent-0">
                <div>아이디 : test@test.com</div>
                <div>비밀번호 : test123</div>
              </div>
            </div>
            <em className="indent-0">
              주의 : 이하 개인정보 처리 방침은 실제 방침이 아닌 예시입니다.
            </em>
            <p>
              RAREBEEF는 이용자의 개인정보 (이하{" "}
              <strong>&quot;개인정보&quot;</strong>)의 기밀성, 무결성 그리고
              보안을 유지하는 것이 중요하다는 것을 인지하고 있습니다. 또한
              RAREBEEF는 다음과 같이 웹사이트를 통해 이용자가 제공한 모든
              개인정보뿐만 아니라 개인정보의 처리를 위탁할 업체에 제공할 모든
              개인 정보를 현재 적용되는 정보통신망 이용촉진 및 정보보호 등에
              관한 법률(이하 “정보통신망법”), “개인정보 보호법” 등 관계 법령 및
              Raebef의 개인정보 처리방침에 따라 처리합니다.
            </p>
          </li>
          <li className="flex flex-col gap-5">
            <strong className="indent-0">
              2. 수집하는 개인정보 항목 및 수집방법
            </strong>
            <p>
              Raebef는 회원에게 서비스를 제공하기 위해 다음과 같은 개인정보를
              수집하고 있습니다. Raebef가 수집하는 회원의 개인정보는 필수항목과
              선택항목이 있는데, 필수항목은 서비스 제공에 반드시 필요한
              사항들이며 선택항목은 고객의 요구에 맞춰 유용하고 더 나은 서비스
              제공을 위한 것으로 선택적 사항에 동의하지 않더라도 서비스 이용에는
              제한이 없습니다.
            </p>
            <p>
              개인정보의 수집은 홈페이지, 서면, 팩스, 전화, E-mail, 이벤트 응모
              등의 수단을 통하여 수집될 수 있습니다.
            </p>

            <ol className="flex flex-col gap-2 p-5 indent-0">
              <li>
                가. 웹사이트 가입 및 계정 생성단계
                <p className="pl-5">- 필수항목: 성명, e-mail, 비밀번호</p>
              </li>
              <li>
                나. 제품 구매 단계
                <p className="pl-5">
                  - 필수항목: 성명, e-mail, 청구 및 배송지 주소(시/도, 시/군/구,
                  우편번호 포함), 결제방법, 휴대전화/전화번호, 구매정보(교환,
                  환불, 수선 포함) (귀하가 등록고객으로서 구매주문을 하는 경우
                  상기 항목들은 귀하의 계정에서 자동으로 업로드 됩니다),
                  대화내용
                </p>
              </li>
              <li>
                다. 고객서비스 제공을 위한 정보 송수신 동의 단계
                <p className="pl-5">
                  - 필수항목: 호칭, 성명, 국가, e-mail, 휴대전화/전화번호, 언어,
                  대화내용
                </p>
              </li>
            </ol>
            <p>
              Raebef의 고객 서비스에 연락할 때 귀하가 동의하는 경우 SMS 메시지로
              귀하의 요청에 응답할 수 있습니다. 당사는 또한 귀하가 당사에 제공한
              휴대폰 번호로 SMS 메시지를 통해 배송 정보를 제공할 수 있습니다.
            </p>
          </li>
          <li className="flex flex-col gap-5">
            <strong className="indent-0">3. 개인정보의 수집 및 이용목적</strong>
            <p>
              이용자의 개인 정보는 서비스 제공을 위한 필요에 따라 다음과 같은
              목적으로 처리 될 수 있습니다:
            </p>

            <ol className="flex flex-col gap-2 p-5 indent-0">
              <li>가. 고객의 모든 요청사항 응대 및 고객관리</li>
              <li>
                나. 고객의 상품 구매를 이행하고 이와 관련된 모든 관리 활동을
                수행하고 (계약의 관리, 금융거래, 상품 배송 또는 청구서 등 발송,
                구매 및 대금 결제, 청구 및 소송 관리, 사기 예방 등), 모든
                적용되는 법규 상 의무 준수.
              </li>
            </ol>
          </li>
          <li className="flex flex-col gap-5">
            <strong className="indent-0">4. 개인정보의 처리 위탁 </strong>
            <p>
              Raebef는 원활한 서비스 제공 및 서비스 품질의 향상을 위해서 고객의
              개인정보를 외부전문업체에 위탁하여 처리할 수 있습니다.
            </p>
            <ol className="flex flex-col gap-2 p-5 indent-0">
              <li>
                가. 회원 인증 서비스와 개인정보의 저장 및 관리를 위해 회원의
                개인정보가 파이어베이스에게 제공됩니다.
              </li>
              <li>
                나. 고객이 상품 대금을 결제할 때, 고객의 신용카드 정보(신용카드
                번호 및 기타 결제 정보 포함)가 결제 정보를 처리하는 당사의 결제
                서비스 제공업체에게 제공됩니다. Raebef는 고객의 신용카드 정보를
                저장하거나 보유하지 않으며 이를 직접 이용하지 않습니다.
              </li>
            </ol>
          </li>
          <li className="flex flex-col gap-5">
            <strong className="indent-0">
              5. 개인정보의 보관 및 이용기간, 파기절차 및 방법
            </strong>
            <p>
              고객이 제공한 개인정보는 Raebef가 제공하는 서비스를 받으시는 동안
              안전하게 보관되며, 다른 법령에 근거하여 보존 의무가 없는 한 고객이
              동의를 철회 혹은 Raebef의 서비스가 종료될 때까지 보관됩니다.
              개인정보는 파이어베이스에 전자적 파일형태 외로는 저장되지 않으며
              전자적 파일형태로 저장된 개인정보는 파이어베이스의 서비스를 통해
              파기합니다.
            </p>
          </li>
          <li className="flex flex-col gap-5">
            <strong className="indent-0">
              6. 개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항
            </strong>
            <ol className="flex flex-col gap-2 p-5 indent-0">
              <li className="flex flex-col gap-1">
                <p>가. 브라우징 데이터</p>
                <p>
                  웹사이트 운영에 사용되는 컴퓨터 시스템 및 소프트웨어 절차는
                  정상 작동 중에, 일부 개인정보(로그 파일)을 취득합니다. 위
                  정보의 전송은 인터넷 통신 프로토콜 사용에 필요합니다. 이러한
                  정보는 특정한 정보주체와 연관 짓기 위해 수집된 것은 아닙니다.
                  그러나, 그 성질상 위 정보는 처리와 제3자가 보유한 정보와의
                  결합 과정에서 이용자를 식별 가능하게 할 수 있습니다. 이러한
                  정보에는 웹사이트에 방문하기 위해 고객이 사용한 IP주소,
                  컴퓨터의 도메인 이름, 요청된 리소스의 URIs(Uniform Resource
                  Identifiers 통합 자원 식별자), 요청 시간, 서버에 대한 요청
                  제출 방법, 응답으로 얻은 파일의 크기, 서버의 응답 상태를
                  나타내는 숫자 코드(완료, 오류 등) 그리고 사용자 운영 체제 및
                  컴퓨터 환경과 관련된 기타 매개변수를 포함합니다. 위 정보는
                  웹사이트 사용과 관련된 익명의 통계 정보를 얻고 올바른 작동을
                  확인하기 위한 목적으로만 사용됩니다.
                </p>
              </li>
              <li className="flex flex-col gap-1">
                <p>나. 쿠키</p>
                <p>
                  쿠키는 웹사이트에서 효율적인 기능을 보장하고 서비스를 개선하기
                  위해 사용됩니다. 쿠키는 웹사이트를 방문함으로써 고객의
                  컴퓨터(대체로 고객의 브라우저로)로 보내지는 작은 텍스트
                  파일입니다. 쿠키는 이후에 방문한 웹사이트에서 인식되기 위해서
                  고객의 컴퓨터에 저장됩니다.
                </p>
                <p>
                  사이트 또는 기타 웹사이트로부터 수령하는 쿠키를 막거나
                  삭제하기를 원하시는 경우, 고객은 특정한 기능을 통하여 브라우저
                  설정을 바꾸실 수 있습니다. 고객은 다음 브라우저들에 대한 거부
                  방법을 다음 링크에서 찾으실 수 있습니다:
                </p>
                <div>
                  <div>
                    - 인터넷 익스플로러-
                    http://windows.microsoft.com/en-gb/windows-vista/block-or-allow-cookies
                  </div>
                  <div>
                    - 크롬 - https://support.google.com/chrome/answer/95647
                  </div>
                  <div>
                    - 파이어폭스 -
                    https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences
                  </div>
                  <div>
                    - 오페라 -
                    http://www.opera.com/help/tutorials/security/privacy/
                  </div>
                  <div>- 사파리 - http://support.apple.com/kb/PH17191</div>
                </div>
              </li>
            </ol>
          </li>
          <li className="flex flex-col gap-5">
            <strong className="indent-0">
              7. 개인정보관리 및 보호책임자 성명 및 연락처
            </strong>
            <p>이름 : 송의영</p>
            <p>e-mail : drrobot409@gmail.com </p>
          </li>
          <li className="flex flex-col gap-5">
            <strong className="indent-0">8. 고지 의무</strong>
            <p>
              RAREBEEF는 본 개인정보 처리 방침을 언제든지 수정할 권리가
              있습니다. 웹사이트에 게시된 버전은 현재 적용되는 것입니다. 해킹 등
              기본적인 네트워크상의 위험성에 의해 발생하는 예기치 못한 사고로
              인한 정보의 훼손 및 방문자가 작성한 게시물에 의한 각종 분쟁에
              관해서는 RAREBEEF는 책임이 없습니다.
            </p>
          </li>
        </ol>
        <em className="mt-10 indent-0">
          마지막 업데이트: 2023년 7 월 31 일. RAREBEEF.
        </em>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
