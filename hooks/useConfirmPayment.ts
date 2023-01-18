import axios from "axios";
import { useQuery } from "react-query";
import { ConfirmPaymentData } from "../types";

const fetch = async (data: ConfirmPaymentData | null) => {
  if (!data) return;

  const url = "/api/confirmPayment";

  const Authorization =
    "Basic " +
    Buffer.from(
      process.env.NEXT_PUBLIC_TOSS_SECRET_KEY as string,
      "utf8"
    ).toString("base64");

  const options = {
    method: "POST",
    url,
    headers: {
      Authorization,
      "Content-Type": "application/json",
    },
    data,
  };

  const response = await axios.request(options);

  return response.data;
};

const useConfirmPayment = (data: ConfirmPaymentData | null) => {
  const query = useQuery({
    queryKey: ["order", data],
    queryFn: () => fetch(data),
    refetchOnWindowFocus: false,
    retry: false,
  });

  return query;
};

export default useConfirmPayment;
