/**
 * Bodea Dashboard Configuration
 *
 * Central configuration for the dashboard block. Update these values to
 * change featured equipment, stock thresholds, navigation items, and map settings.
 */

/**
 * Stock level below which an item is considered "low stock".
 * TODO: Connect to Commerce inventory threshold config when MSI API is available.
 */
export const LOW_STOCK_THRESHOLD = 250;

/**
 * REST API path prefix for the core Commerce instance (Magento store scope).
 * Used to build `GET {origin}{prefix}/V1/orders?...` alongside the GraphQL endpoint.
 * Change if your deployment uses a different store code (e.g. `/rest/all`).
 */
export const COMMERCE_REST_PATH_PREFIX = '/rest/default';

/**
 * Query string value for the spend-trend orders endpoint (rolling 12 weeks).
 */
export const SPEND_TREND_DATE_RANGE = 'rolling12w';

/** Week counts available in the dashboard spend-trend period filter (oldest → chart width). */
export const SPEND_TREND_PERIOD_OPTIONS = [4, 8, 12];

/** Default selected period (weeks) when the panel loads. */
export const DEFAULT_SPEND_TREND_WEEKS = 12;

/**
 * Featured tire SKUs (Commerce catalog). Continental passenger-car tire lines.
 */
export const FEATURED_EQUIPMENT_SKUS = [
  'ASC2-205-55-R16',
  'EC6-225-45-R18',
  'PC7-245-40-R19',
  'WT870P-225-45-R18',
  'SC7-255-35-R20',
  'WT870P-245-40-R19',
];

/** Primary SKU for demo low-stock / notifications (first featured line). */
export const PRIMARY_EQUIPMENT_SKU = FEATURED_EQUIPMENT_SKUS[0];

/**
 * Product titles for Commerce name field and UI (Continental line – tire size).
 */
export const EQUIPMENT_CATALOG_NAMES = {
  'ASC2-205-55-R16': 'AllSeasonContact 2 – 205/55 R16',
  'EC6-225-45-R18': 'EcoContact 6 – 225/45 R18',
  'PC7-245-40-R19': 'PremiumContact 7 – 245/40 R19',
  'WT870P-225-45-R18': 'WinterContact TS 870 P – 225/45 R18',
  'SC7-255-35-R20': 'SportContact 7 – 255/35 R20',
  'WT870P-245-40-R19': 'WinterContact TS 870 P – 245/40 R19',
};

/**
 * Dashboard card labels (same as catalog titles; fallback if Commerce name is unavailable).
 */
export const EQUIPMENT_DISPLAY_NAMES = { ...EQUIPMENT_CATALOG_NAMES };

/**
 * Demo list price (USD) per tire. Used as a fallback when Commerce returns no price
 * for the SKU.
 */
export const EQUIPMENT_CATALOG_PRICES_USD = {
  'ASC2-205-55-R16': 109,
  'EC6-225-45-R18': 121,
  'PC7-245-40-R19': 158,
  'WT870P-225-45-R18': 136,
  'SC7-255-35-R20': 194,
  'WT870P-245-40-R19': 164,
};

/**
 * Legacy SKUs → canonical tire SKUs (Commerce migration; see scripts).
 */
export const LEGACY_EQUIPMENT_SKU_MIGRATION = [
  { from: 'CHEP-UK-WOOD-1200X1000-01', to: 'ASC2-205-55-R16' },
  { from: 'CHEP-EU-WOOD-1200X800-03', to: 'EC6-225-45-R18' },
  { from: 'CHEP-WOOD-METAL-800X600-08', to: 'PC7-245-40-R19' },
  { from: 'CHEP-PLASTIC-1200X800-01120', to: 'WT870P-225-45-R18' },
  { from: 'CHEP-PLASTIC-1200X1000-LIPS-00077', to: 'SC7-255-35-R20' },
  { from: 'CHEP-PLASTIC-QTR-600X400-16', to: 'WT870P-245-40-R19' },
];

/**
 * Intermediate SKUs → canonical tire SKUs (after earlier migration).
 */
export const EQUIPMENT_MSY_TO_BR_SKU_MIGRATION = [
  { from: 'HCS-MSY-FAC-215102565-450', to: 'ASC2-205-55-R16' },
  { from: 'HCS-MSY-ENG-215102565-350', to: 'EC6-225-45-R18' },
  { from: 'HCS-MSY-CMU-215102565-450', to: 'PC7-245-40-R19' },
  { from: 'HCS-MSY-COM-215102565-450', to: 'WT870P-225-45-R18' },
  { from: 'HCS-MSY-PRF-215102565-450', to: 'SC7-255-35-R20' },
  { from: 'HCS-MSY-AIR-215065-040', to: 'WT870P-245-40-R19' },
];

/**
 * Placeholder stock capacity values per SKU for visual progress bars.
 *
 * DATA NOTE: Precise inventory quantities require the Magento Inventory (MSI)
 * API or a warehouse management integration. The `only_x_left_in_stock` field
 * from the products GraphQL query is used when available. These capacity values
 * are used as the denominator for the stock level bar only.
 */
export const EQUIPMENT_STOCK_CAPACITY = {
  'ASC2-205-55-R16': 500,
  'EC6-225-45-R18': 400,
  'PC7-245-40-R19': 500,
  'WT870P-225-45-R18': 500,
  'SC7-255-35-R20': 500,
  'WT870P-245-40-R19': 60,
};

/**
 * Left-hand navigation items.
 * `id` is used for active state detection (matched against pathname).
 */
export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    matchPaths: ['/', '/dashboard'],
    icon: 'dashboard',
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '/order-list',
    matchPaths: ['/order-list', '/customer/orders', '/customer/order-details'],
    icon: 'orders',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    href: '/invoices',
    matchPaths: ['/invoices', '/customer/invoices'],
    icon: 'invoices',
  },
  {
    id: 'company-users',
    label: 'Company Users',
    href: '/users',
    matchPaths: ['/users'],
    icon: 'companyUsers',
  },
  {
    id: 'materials',
    label: 'Materials',
    href: '/order',
    matchPaths: ['/order', '/order-new-delivery', '/equipment'],
    icon: 'materials',
  },
  {
    id: 'locations',
    label: 'Locations',
    /** DA `locations` (`locations.html`) — Bodea Address Book (map + addresses). */
    href: '/locations',
    matchPaths: ['/locations'],
    icon: 'locations',
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/order-list',
    matchPaths: ['/reports'],
    icon: 'reports',
  },
  {
    id: 'support',
    label: 'Support',
    href: '/support',
    matchPaths: ['/support'],
    icon: 'support',
  },
];

/**
 * Quick action buttons rendered in the Quick Actions card.
 * `primary` flags the primary CTA with accent styling.
 */
export const QUICK_ACTIONS = [
  {
    id: 'create-order',
    label: 'Create New Order',
    href: '/order',
    icon: 'plus',
    primary: true,
  },
  {
    id: 'manage-inventory',
    label: 'Manage Inventory',
    href: '/customer/account',
    icon: 'inventory',
  },
  {
    id: 'view-orders',
    label: 'View All Orders',
    href: '/order-list',
    icon: 'orders',
  },
  {
    id: 'view-locations',
    label: 'View Locations',
    href: '/locations',
    icon: 'locations',
  },
];

/**
 * Map configuration.
 * Uses Leaflet.js from jsDelivr + OpenStreetMap tiles (no API key required).
 * To swap providers, update tileUrl / attribution / subdomains here.
 */
export const MAP_CONFIG = {
  /** Geographic centre of the UK */
  center: [54.2, -2.5],
  zoom: 5,
};

/**
 * Optional manual map coordinates keyed by delivery site id (Commerce address uid).
 * Markers are normally resolved via OpenStreetMap Nominatim from address fields;
 * add entries here only when you need to override geocoding for a specific address.
 */
export const SITE_COORDINATES = {};

/**
 * Magento order statuses considered "active" (in-progress, not yet fulfilled).
 * Used to derive the Active Orders KPI count.
 */
export const ACTIVE_ORDER_STATUSES = [
  'pending',
  'pending_payment',
  'payment_review',
  'processing',
  'holded',
  'fraud',
];

/**
 * Magento order statuses mapped to dashboard display labels and visual variants.
 */
export const ORDER_STATUS_MAP = {
  pending: { label: 'Pending', variant: 'warning' },
  pending_payment: { label: 'Pending Payment', variant: 'warning' },
  payment_review: { label: 'Payment Review', variant: 'warning' },
  processing: { label: 'Processing', variant: 'info' },
  holded: { label: 'On Hold', variant: 'alert' },
  complete: { label: 'Complete', variant: 'positive' },
  closed: { label: 'Closed', variant: 'neutral' },
  canceled: { label: 'Cancelled', variant: 'neutral' },
  fraud: { label: 'Suspected Fraud', variant: 'alert' },
};
