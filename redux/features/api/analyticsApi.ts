import { indexApi } from "./indexApi";

export const analyticsApi = indexApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesAnalytics: builder.query({
      query: () => ({
        url: "get-course-analytics",
        method: "GET",
        credentials: "include",
      }),
    }),
    getOrdersAnalytics: builder.query({
      query: () => ({
        url: "get-order-analytics",
        method: "GET",
        credentials: "include",
      }),
    }),
    getUsersAnalytics: builder.query({
      query: () => ({
        url: "get-user-analytics",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
  overrideExisting: "throw",
});

export const {
  useGetCoursesAnalyticsQuery,
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
} = analyticsApi;
