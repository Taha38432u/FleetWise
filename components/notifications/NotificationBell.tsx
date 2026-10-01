"use client";

import { useState } from "react";
import { Indicator, Loader, ScrollArea } from "@mantine/core";
import { IconBell, IconCheck, IconTrash } from "@tabler/icons-react";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useNotifications({ pageSize: 10 });
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const removeNotification = useDeleteNotification();

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((item: any) => !item.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl border border-line p-2 text-slate-700 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-primary active:scale-[0.99]"
        aria-label="Open notifications"
      >
        <Indicator
          inline
          disabled={unreadCount === 0}
          label={unreadCount > 9 ? "9+" : unreadCount}
          size={16}
          color="green"
        >
          <IconBell size={20} />
        </Indicator>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-line bg-white text-slate-900 shadow-[0_16px_40px_rgba(16,33,22,0.12)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-extrabold text-ink">Notifications</p>
              <p className="text-xs font-medium text-muted">
                {unreadCount} unread
              </p>
            </div>
            <button
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="rounded-lg px-2 py-1 text-xs font-bold text-primary hover:bg-green-50 hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              Mark all read
            </button>
          </div>

          <ScrollArea.Autosize mah={360}>
            {isLoading ? (
              <div className="flex items-center justify-center px-4 py-10">
                <Loader size="sm" />
              </div>
            ) : notifications.length ? (
              notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`border-b border-slate-100 px-4 py-3 transition-colors ${
                    notification.isRead ? "bg-white" : "bg-green-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => markRead.mutate(notification.id)}
                          disabled={markRead.isPending}
                          className="rounded-md p-1 text-slate-500 hover:bg-green-100 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                          title="Mark read"
                        >
                          <IconCheck size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification.mutate(notification.id)}
                        disabled={removeNotification.isPending}
                        className="rounded-md p-1 text-slate-500 hover:bg-green-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        title="Delete notification"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-extrabold text-ink">
                  All clear
                </p>
                <p className="mt-1 text-xs text-muted">
                  New fleet alerts will show up here.
                </p>
              </div>
            )}
          </ScrollArea.Autosize>
        </div>
      )}
    </div>
  );
}
