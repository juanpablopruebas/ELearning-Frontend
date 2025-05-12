import { indexApi } from "./indexApi";
import type { NotificationData } from "@/types";

export const notificationApi = indexApi.injectEndpoints({
  overrideExisting: "throw",
  endpoints: (builder) => ({
    getNotifications: builder.query<
      { notifications: NotificationData[] },
      void
    >({
      query: () => ({
        url: "get-notifications",
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.notifications.map((n) => ({
                type: "Notifications" as const,
                id: n._id,
              })),
              { type: "Notifications" as const, id: "LIST" },
            ]
          : [{ type: "Notifications" as const, id: "LIST" }],
    }),

    updateNotificationStatus: builder.mutation<void, string>({
      query: (id) => ({
        url: `update-notification/${id}`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Notifications" as const, id },
        { type: "Notifications" as const, id: "LIST" },
      ],
    }),
  }),
});

export const { useGetNotificationsQuery, useUpdateNotificationStatusMutation } =
  notificationApi;
