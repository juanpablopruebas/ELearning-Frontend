"use client";

import { useSocket } from "@/app/utils/SocketProvider";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/api/notificationApi";
import { NotificationData } from "@/types";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdNotifications } from "react-icons/md";
import { format } from "timeago.js";

export const DashboardHeader = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const socket = useSocket();

  const { data, refetch } = useGetNotificationsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [updateNotificationStatus, { isSuccess, isLoading }] =
    useUpdateNotificationStatusMutation();

  const [audio] = useState(
    new Audio(
      "https://res.cloudinary.com/ddecqru91/video/upload/v1745731969/ding-126626_fbpaln.mp3"
    )
  );

  const playNotificationSound = useCallback(() => {
    audio.play();
  }, [audio]);

  useEffect(() => {
    if (data?.notifications) {
      setNotifications(
        data.notifications.filter(
          (item: NotificationData) => item.status === "unread"
        )
      );
    }

    if (isSuccess) {
      refetch();
    }
    audio.load();
  }, [audio, data?.notifications, isSuccess, refetch]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      refetch();
      if (pathname?.startsWith("/admin")) {
        playNotificationSound();
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, pathname, refetch, playNotificationSound]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationStatusChange = (id: string) => {
    if (isLoading) return;
    updateNotificationStatus(id);
  };

  return (
    <header className="w-full p-4 flex items-center justify-end bg-gray-100 dark:bg-zinc-800 relative">
      <ThemeSwitcher />
      <div className="relative ml-4">
        <button
          aria-label="Notifications"
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
        >
          <MdNotifications
            size={24}
            className="text-gray-700 dark:text-gray-300"
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>
        {open && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-xl z-20 border border-gray-200 dark:border-zinc-700"
          >
            <div className="py-3 px-4 border-b border-gray-200 dark:border-zinc-700">
              <h5 className="text-base font-semibold text-gray-800 dark:text-white text-center">
                Notifications
              </h5>
            </div>
            <div className="p-4 space-y-4 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  No new notifications.
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className="space-y-1 border-b pb-3 last:border-none"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {n.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(n.createdAt)}
                    </p>
                    <button
                      onClick={() => handleNotificationStatusChange(n._id)}
                      className="text-blue-600 text-xs hover:underline disabled:opacity-50"
                    >
                      Mark as read
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
