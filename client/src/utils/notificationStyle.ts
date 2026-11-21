type NotificationStyle = {
  module: string;
  menu: string;
  icon: string;
  container: string;
  iconContainer: string;
  iconColor: string;
};

const styles: Record<string, NotificationStyle> = {
  inventory: {
    module: 'Inventory',
    menu: 'Inventory',
    icon: 'mdi:warehouse',
    container: 'border-l-4 border-emerald-500 bg-emerald-50',
    iconContainer: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
  },
  accounts: {
    module: 'Accounts',
    menu: 'Accounts',
    icon: 'mdi:calculator-variant-outline',
    container: 'border-l-4 border-violet-500 bg-violet-50',
    iconContainer: 'bg-violet-100',
    iconColor: 'text-violet-700',
  },
  production: {
    module: 'Inventory',
    menu: 'Production',
    icon: 'mdi:factory',
    container: 'border-l-4 border-blue-500 bg-blue-50',
    iconContainer: 'bg-blue-100',
    iconColor: 'text-blue-700',
  },
  bmr: {
    module: 'Inventory',
    menu: 'BMR',
    icon: 'mdi:clipboard-text-clock-outline',
    container: 'border-l-4 border-orange-500 bg-orange-50',
    iconContainer: 'bg-orange-100',
    iconColor: 'text-orange-700',
  },
  dispatch: {
    module: 'Inventory',
    menu: 'Dispatch',
    icon: 'mdi:truck-delivery-outline',
    container: 'border-l-4 border-cyan-500 bg-cyan-50',
    iconContainer: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
  },
  qaqc: {
    module: 'Inventory',
    menu: 'QA / QC',
    icon: 'mdi:flask-outline',
    container: 'border-l-4 border-fuchsia-500 bg-fuchsia-50',
    iconContainer: 'bg-fuchsia-100',
    iconColor: 'text-fuchsia-700',
  },
};

export const getNotificationStyle = (notification: { title?: string; link?: string }): NotificationStyle => {
  const title = String(notification?.title || '').toLowerCase();
  const link = String(notification?.link || '').toLowerCase().split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
  const value = `${title} ${link}`;
  const menuByPath: Record<string, string> = {
    'inventory/store': 'Store',
    'inventory/qc': 'Store QC',
    'inventory/qc-batch': 'QC Batch',
    'inventory/production': 'Production',
    'inventory/planing': 'Production Planning',
    'inventory/finishing': 'Finishing',
    'inventory/dispatch': 'Dispatch',
    'inventory/bmr': 'BMR',
    'inventory/bmr-report': 'BMR Report',
    'accounts/purchase': 'Purchase',
    'accounts/payment': 'Payment',
    'accounts/tax-invoice': 'Tax Invoice',
  };
  const routeMenu = menuByPath[link];

  const withMenu = (style: NotificationStyle): NotificationStyle => ({
    ...style,
    menu: routeMenu || style.menu,
  });

  if (/dispatch|shipment|delivery/.test(value)) return withMenu(styles.dispatch);
  if (/\bbmr\b/.test(value)) return withMenu(styles.bmr);
  if (/\bqa\b|\bqc\b|quality|sample-qc|qc-batch|qc\//.test(value)) return withMenu(styles.qaqc);
  if (/production|planing|planning/.test(value)) return withMenu(styles.production);
  if (/account|invoice|payment|ledger|purchase/.test(value)) return withMenu(styles.accounts);
  if (/inventory|store|grn|material|warehouse/.test(value)) return withMenu(styles.inventory);

  return {
    module: 'General',
    menu: 'Notifications',
    icon: 'mdi:bell-outline',
    container: 'border-l-4 border-slate-400 bg-slate-50',
    iconContainer: 'bg-slate-100',
    iconColor: 'text-slate-600',
  };
};
