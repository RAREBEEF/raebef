import { doc, setDoc } from "firebase/firestore";
import { db } from "../fb";
import { ErrorReport } from "../types";

const useReportError = () => {
  const reportError = async (report: ErrorReport) => {
    await setDoc(doc(db, "error", "test"), report);
  };

  return reportError;
};

export default useReportError;
