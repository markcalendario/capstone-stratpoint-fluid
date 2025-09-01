import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "notificationPreference";

type NotificationPreference = {
  invitation: boolean;
};

const defaultPreference: NotificationPreference = {
  invitation: true
};

export function useNotificationPreference() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [preference, setPreference] =
    useState<NotificationPreference>(defaultPreference);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed.invitation === "boolean") setPreference(parsed);
      } catch {
        console.error("Failed to parse notification preference.");
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  }, [preference, isLoaded]);

  const updatePreference = useCallback(
    (updated: Partial<NotificationPreference>) => {
      setPreference((prev) => ({
        ...prev,
        ...updated
      }));
    },
    []
  );

  return {
    preference,
    setPreference: updatePreference
  };
}
