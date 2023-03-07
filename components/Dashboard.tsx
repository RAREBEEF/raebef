import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { DashboardDataType } from "../types";

interface Props {
  data: { [key in string]: DashboardDataType };
}

const Dashboard: React.FC<Props> = ({ data }) => {
  const [curMonth, setCurMonth] = useState<string | number>("");
  const [totalData, setTotalData] = useState<DashboardDataType>({
    amount: 0,
    orders: 0,
  });
  const [monthlyData, setMonthlyData] = useState<DashboardDataType>({
    amount: 0,
    orders: 0,
  });
  const [chartData, setChartData] = useState<ChartData<
    any,
    Array<number>
  > | null>(null);
  ChartJS.register(ArcElement, Tooltip, Legend);

  // 데이터 정제
  useEffect(() => {
    if (!data) return;

    const today = new Date();
    const curYear = today.getFullYear();
    const curMonth = today.getMonth() + 1;
    setCurMonth(curMonth);

    const monthly = `${curYear}-${curMonth.toString().padStart(2, "0")}`;

    console.log(monthly);

    let gmv = 0;
    let orders = 0;

    Object.entries(data).forEach((cur, i) => {
      gmv += cur[1].amount;
      orders += cur[1].orders;
    });

    setTotalData({ amount: gmv, orders });
    setMonthlyData((prev) => data[monthly] || prev);

    console.log(data);

    setChartData({
      labels: Object.keys(data),
      datasets: [
        {
          id: "amount",
          type: "line",
          fill: true,
          label: "매출액",
          data: Object.values(data).map((cur) => cur.amount),
          backgroundColor: ["rgba(54, 162, 235, 0.2)"],
          borderColor: ["rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
        {
          type: "bar",
          barPercentage: 0.3,
          yAxisID: "y1",
          id: "orders",
          label: "주문수",
          data: Object.values(data).map((cur) => cur.orders),
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    });
  }, [data]);

  return (
    <section className="flex flex-col gap-24 pb-24 text-zinc-800">
      <div>
        <h1 className="mb-12 text-center text-3xl font-bold">전체 기간</h1>
        <div className="flex flex-wrap flex-wrap-reverse items-center justify-center gap-5">
          <div className="max-w-screen aspect-video basis-[60%]">
            {chartData && (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  interaction: {
                    mode: "index",
                    intersect: false,
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: "GMV 추이",
                    },
                    subtitle: {
                      display: true,
                      text: "23년 1월 이전 데이터는 차트 테스트를 위해 추가한 가상 데이터이며 주문 내역은 존재하지 않습니다.",
                    },
                  },
                  scales: {
                    y: {
                      type: "linear",
                      display: true,
                      position: "left",
                      min: 0,
                      title: {
                        display: true,
                        text: "총매출",
                      },
                    },
                    y1: {
                      type: "linear",
                      display: true,
                      position: "right",
                      grid: {
                        drawOnChartArea: false,
                      },
                      title: {
                        display: true,
                        text: "주문수",
                      },
                      min: 0,
                      ticks: {
                        autoSkip: false,
                        callback: function (label) {
                          if (Math.floor(label as number) === label) {
                            return label;
                          }
                        },
                      },
                    },
                  },
                }}
              />
            )}
          </div>
          <ul className="grid min-w-[400px] grow basis-[30%] grid-cols-3 gap-5">
            <li className="flex flex-col items-center justify-evenly gap-2 rounded-lg bg-zinc-100 p-5">
              <h2 className="break-keep text-center text-lg font-bold text-zinc-600">
                총 주문 건수
              </h2>
              <div className="whitespace-nowrap text-center text-2xl font-semibold md:text-xl">
                {totalData.orders.toLocaleString("ko-KR") || 0}
              </div>
            </li>
            <li className="flex flex-col items-center justify-evenly gap-2 rounded-lg bg-zinc-100 p-5">
              <h2 className="break-keep text-center text-lg font-bold text-zinc-600">
                총 매출액
              </h2>
              <div className="whitespace-nowrap text-center text-2xl font-semibold md:text-xl">
                {totalData.amount.toLocaleString("ko-KR") || 0} ₩
              </div>
            </li>
            <li className="flex flex-col items-center justify-evenly gap-2 rounded-lg bg-zinc-100 p-5">
              <h2 className="break-keep text-center text-lg font-bold text-zinc-600">
                주문당 평균 금액
              </h2>
              <div className="whitespace-nowrap text-center text-2xl font-semibold md:text-xl">
                {Math.floor(totalData.amount / totalData.orders).toLocaleString(
                  "ko-KR"
                ) || 0}{" "}
                ₩
              </div>
            </li>
            <li className="flex flex-col items-center justify-evenly gap-2 rounded-lg bg-zinc-100 p-5">
              <h2 className="break-keep text-center text-lg font-bold text-zinc-600">
                월 평균 주문 건수
              </h2>
              <div className="whitespace-nowrap text-center text-2xl font-semibold md:text-xl">
                {(totalData.orders / Object.keys(data).length).toLocaleString(
                  "ko-KR"
                ) || 0}
              </div>
            </li>
            <li className="flex flex-col items-center justify-evenly gap-2 rounded-lg bg-zinc-100 p-5">
              <h2 className="break-keep text-center text-lg font-bold text-zinc-600">
                월 평균 매출액
              </h2>
              <div className="whitespace-nowrap text-center text-2xl font-semibold md:text-xl">
                {Math.floor(
                  totalData.amount / Object.keys(data).length
                ).toLocaleString("ko-KR") || 0}{" "}
                ₩
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h1 className="mb-12 text-center text-3xl font-bold">
          {curMonth}월 통계
        </h1>
        <ul className="grid grow basis-[30%] grid-cols-3 gap-5">
          <li className="flex flex-col items-center justify-evenly gap-2 rounded-lg bg-zinc-100 p-5">
            <h2 className="break-keep text-center text-lg font-bold text-zinc-600">
              월간 주문 건수
            </h2>
            <div className="whitespace-nowrap text-center text-2xl font-semibold md:text-xl">
              {monthlyData.orders.toLocaleString("ko-KR") || 0}
            </div>
          </li>
          <li className="justify-evenlsy flex flex-col items-center gap-2 rounded-lg bg-zinc-100 p-5">
            <h2 className="break-keep text-center text-lg font-bold text-zinc-600">
              월간 매출액
            </h2>
            <div className="whitespace-nowrap text-center text-2xl font-semibold md:text-xl">
              {monthlyData.amount.toLocaleString("ko-KR") || 0} ₩
            </div>
          </li>
          <li className="flex flex-col items-center justify-evenly gap-2 rounded-lg bg-zinc-100 p-5">
            <h2 className="break-keep text-center text-lg font-bold text-zinc-600">
              주문당 평균 금액
            </h2>
            <div className="whitespace-nowrap text-center text-2xl font-semibold md:text-xl">
              {Math.floor(
                monthlyData.amount / monthlyData.orders || 0
              ).toLocaleString("ko-KR") || 0}{" "}
              ₩
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Dashboard;
