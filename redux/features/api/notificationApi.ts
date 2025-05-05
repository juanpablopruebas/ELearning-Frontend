import { indexApi } from "./indexApi";

export const notificationApi = indexApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "get-notifications",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateNotificationStatus: builder.mutation({
      query: (id) => ({
        url: `update-notification/${id}`,
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
  overrideExisting: "throw",
});

export const { useGetNotificationsQuery, useUpdateNotificationStatusMutation } =
  notificationApi;
