"use client";

import { UsersAnalytics } from "./users-analytics/UsersAnalytics";
import { PiAcorn, PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import { OrdersAnalytics } from "./orders-analytics/OrdersAnalytics";
import { AllInvoices } from "./orders-analytics/AllInvoices";
import { useEffect, useState } from "react";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/api/analyticsApi";
import { Loader } from "../layout/Loader";

type CircularProgressWithLabelProps = {
  value?: number;
};

const CircularProgressWithLabel = ({
  value,
}: CircularProgressWithLabelProps) => {
  return (
    <Box className="relative inline-flex">
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
      />
      <Box className="absolute inset-0 flex items-center justify-center" />
    </Box>
  );
};

export const DashboardWidgets = () => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<{
    current: number;
    previous: number;
    percentage: number;
  }>();
  const [userComparePercentage, setUserComparePercentage] = useState<{
    current: number;
    previous: number;
    percentage: number;
  }>();

  const { data: userData, isLoading: isLoadingUser } =
    useGetUsersAnalyticsQuery({});
  const { data: orderData, isLoading: isLoadingOrder } =
    useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (orderData?.orders && userData?.users) {
      const usersLastTwoMonths = userData.users.last12Months.slice(-2);
      const ordersLastTwoMonths = orderData.orders.last12Months.slice(-2);
      if (usersLastTwoMonths.length === 2 && ordersLastTwoMonths.length === 2) {
        const usersCurrentMonth = usersLastTwoMonths[1].count;
        const usersPreviousMonth = usersLastTwoMonths[0].count;
        const ordersCurrentMonth = ordersLastTwoMonths[1].count;
        const ordersPreviousMonth = ordersLastTwoMonths[0].count;

        const usersPercentChange =
          usersPreviousMonth !== 0
            ? ((usersCurrentMonth - usersPreviousMonth) / usersPreviousMonth) *
              100
            : 100;
        const ordersPercentChange =
          ordersPreviousMonth !== 0
            ? ((ordersCurrentMonth - ordersPreviousMonth) /
                ordersPreviousMonth) *
              100
            : 100;

        setUserComparePercentage({
          current: usersCurrentMonth,
          previous: usersPreviousMonth,
          percentage: usersPercentChange,
        });
        setOrdersComparePercentage({
          current: ordersCurrentMonth,
          previous: ordersPreviousMonth,
          percentage: ordersPercentChange,
        });
      }
    }
  }, [orderData?.orders, userData?.users]);

  if (isLoadingOrder || isLoadingUser) {
    return <Loader />;
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <UsersAnalytics isDashboard />

        <div className="flex flex-col space-y-4 justify-center">
          <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 rounded-md shadow">
            <div className="flex items-center space-x-2">
              <PiAcorn className="text-xl" />
              <div>
                <h5 className="text-lg font-bold">
                  {ordersComparePercentage?.current}
                </h5>
                <p className="text-sm">Sales Obtained</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <CircularProgressWithLabel
                value={ordersComparePercentage?.percentage ?? 0 > 0 ? 100 : 0}
              />
              <h5 className="text-sm mt-1">
                {ordersComparePercentage?.percentage ?? 0
                  ? `${(ordersComparePercentage?.percentage ?? 0).toFixed(1)} %`
                  : null}
              </h5>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 rounded-md shadow">
            <div className="flex items-center space-x-2">
              <PiUsersFourLight className="text-xl" />
              <div>
                <h5 className="text-lg font-bold">
                  {userComparePercentage?.current}
                </h5>
                <p className="text-sm">New Users</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <CircularProgressWithLabel
                value={userComparePercentage?.percentage ?? 0 > 0 ? 100 : 0}
              />
              <h5 className="text-sm mt-1">
                {userComparePercentage?.percentage ?? 0
                  ? `${(userComparePercentage?.percentage ?? 0).toFixed(1)} %`
                  : null}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 w-full">
        <div>
          <OrdersAnalytics isDashboard />
        </div>
        <div>
          <AllInvoices isDashboard />
        </div>
      </div>
    </section>
  );
};
