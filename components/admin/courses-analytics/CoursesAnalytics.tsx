"use client";

import { Loader } from "@/components/layout/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/api/analyticsApi";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const CoursesAnalytics = () => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery({});

  const analyticsData = useMemo(() => {
    if (data?.courses?.last12Months?.length > 0) {
      return data.courses.last12Months.map(
        (item: { month: string; count: number }) => ({
          name: item.month,
          value: item.count,
        })
      );
    }
    return [];
  }, [data]);

  return (
    <div className="w-full min-h-[60vh] text-zinc-900 dark:text-white rounded-xl p-6 shadow-sm border border-zinc-300 dark:border-zinc-700">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Course Analytics</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Last 12 months of course creation statistics
            </p>
          </div>

          {analyticsData.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              No analytics data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
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
                  cursor={{ fill: "rgba(63, 175, 130, 0.1)" }}
                />
                <Bar dataKey="value" fill="#3faf82" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
};
