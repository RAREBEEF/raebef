import { doc, setDoc } from "firebase/firestore";
import { db } from "../fb";
import { ErrorReport } from "../types";
import { v4 as uuidv4 } from "uuid";

const useReportError = () => {
  const reportError = async (report: ErrorReport) => {
    const ok = window.confirm(
      "오류 수정을 위해 에러 정보를 전송 하시겠습니까?\n보내주신 에러 보고서는 사이트 이용 경험 개선에 큰 도움이 됩니다."
    );

    if (ok) {
      await setDoc(doc(db, "error", uuidv4()), report).then(() => {
        window.alert("에러 보고서가 전송되었습니다.\n감사합니다.");
      });
    }
  };

  return reportError;
};

export default useReportError;
