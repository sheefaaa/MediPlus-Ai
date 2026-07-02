import { useEffect, useRef } from "react";

import type { Reminder } from "../lib/types";

export const useNotifications = (reminders: Reminder[], enabled: boolean) => {
  const shownRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || Notification.permission !== "granted") {
      return;
    }

    const timer = window.setInterval(() => {
      const now = Date.now();
      reminders.forEach((reminder) => {
        const reminderTime = new Date(reminder.reminder_time).getTime();
        const isUpcoming = reminderTime >= now && reminderTime - now <= 5 * 60 * 1000;
        if (isUpcoming && !shownRef.current.has(reminder.id) && !reminder.completed) {
          new Notification("Medicine Reminder", {
            body: `${reminder.medicine_name ?? "Medicine"} is coming up soon.`,
          });
          shownRef.current.add(reminder.id);
        }
      });
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [enabled, reminders]);
};
