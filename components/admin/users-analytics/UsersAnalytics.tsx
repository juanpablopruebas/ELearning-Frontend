"use client";

import { Loader } from "@/components/layout/Loader";
import { useGetUsersAnalyticsQuery } from "@/redux/features/api/analyticsApi";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type UsersAnalyticsType = {
  isDashboard?: boolean;
};

export const UsersAnalytics = ({ isDashboard = false }: UsersAnalyticsType) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

  const analyticsData = useMemo(() => {
    if (data?.users?.last12Months?.length > 0) {
      return data.users.last12Months.map(
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
            <h2 className="text-2xl font-bold">Users Analytics</h2>
            {!isDashboard && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Last 12 months of user activity
              </p>
            )}
          </div>

          {analyticsData.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              No analytics data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={isDashboard ? 250 : 450}>
              <AreaChart
                data={analyticsData}
                margin={{ top: 20, right: 30, bottom: 0, left: 0 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#ccc",
                    fontSize: "14px",
                  }}
                  cursor={{ stroke: "#4d62d9", strokeWidth: 0.3 }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4d62d9"
                  fill="rgba(77, 98, 217, 0.2)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
};
