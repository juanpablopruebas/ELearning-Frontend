"use client";

import { Loader } from "@/components/layout/Loader";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/api/analyticsApi";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OrdersAnalyticsType = {
  isDashboard?: boolean;
};

export const OrdersAnalytics = ({
  isDashboard = false,
}: OrdersAnalyticsType) => {
  const { data, isLoading } = useGetOrdersAnalyticsQuery({});

  const analyticsData = useMemo(() => {
    if (data?.orders?.last12Months?.length > 0) {
      return data.orders.last12Months.map(
        (item: { month: string; count: number }) => ({
          name: item.month,
          count: item.count,
        })
      );
    }
    return [];
  }, [data]);

  return (
    <div
      className={`w-full ${isDashboard ? "" : "min-h-[60vh]"} text-zinc-900 dark:text-white rounded-xl p-6 ${
        isDashboard ? "" : "border border-zinc-300 dark:border-zinc-700 shadow-sm"
      }`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Orders Analytics</h2>
            {!isDashboard && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Last 12 months of order statistics
              </p>
            )}
          </div>

          {analyticsData.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              No analytics data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={isDashboard ? 250 : 450}>
              <LineChart
                data={analyticsData}
                margin={{ top: 20, right: 30, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#ccc",
                    fontSize: "14px",
                  }}
                  cursor={{ stroke: "#3faf82", strokeWidth: 0.3 }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3faf82"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
};
