export type SidebarNotification = {
  link?: string;
  is_read?: number | string | boolean;
};

export const normalizeNotificationPath = (path?: string) => {
  const rawPath = String(path || '').split(/[?#]/)[0];
  try {
    return decodeURIComponent(new URL(rawPath, window.location.origin).pathname)
      .replace(/\/+$/, '')
      .toLowerCase() || '/';
  } catch {
    return rawPath.replace(/\/+$/, '').toLowerCase() || '/';
  }
};

export const getUnreadNotificationCount = (
  notifications: SidebarNotification[] = [],
  urls: (string | undefined)[] = [],
) => {
  const paths = new Set(urls.filter(Boolean).map((url) => normalizeNotificationPath(url)));

  return notifications.filter((notification) => {
    const isUnread = notification.is_read === 0 || notification.is_read === '0' || notification.is_read === false;
    return isUnread && paths.has(normalizeNotificationPath(notification.link));
  }).length;
};
