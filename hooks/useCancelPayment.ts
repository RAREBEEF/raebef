import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

const useCancelPayment = ({
  paymentKey,
  cancelReason,
}: {
  paymentKey: string | null;
  cancelReason: string;
}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["cancelPayment", paymentKey, cancelReason],
    queryFn: () => fetch({ paymentKey, cancelReason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useCancelPayment;

const fetch = async ({
  paymentKey,
  cancelReason,
}: {
  paymentKey: string | null;
  cancelReason: string;
}) => {
  if (!paymentKey) return;

  const url = "/api/cancelPayment/" + paymentKey;

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
    data: { cancelReason },
  };

  const response = await axios.request(options);

  return response.data;
};
