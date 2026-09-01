import { EQUIPMENT_CATALOG_NAMES } from '../bodea-dashboard/dashboard-config.js';

export const EQUIPMENT_PRODUCTS = [
  {
    label: EQUIPMENT_CATALOG_NAMES['ASC2-205-55-R16'],
    sku: 'ASC2-205-55-R16',
    material: 'all-season',
  },
  {
    label: EQUIPMENT_CATALOG_NAMES['EC6-225-45-R18'],
    sku: 'EC6-225-45-R18',
    material: 'summer',
  },
  {
    label: EQUIPMENT_CATALOG_NAMES['PC7-245-40-R19'],
    sku: 'PC7-245-40-R19',
    material: 'summer',
  },
  {
    label: EQUIPMENT_CATALOG_NAMES['WT870P-225-45-R18'],
    sku: 'WT870P-225-45-R18',
    material: 'winter',
  },
  {
    label: EQUIPMENT_CATALOG_NAMES['SC7-255-35-R20'],
    sku: 'SC7-255-35-R20',
    material: 'summer',
  },
  {
    label: EQUIPMENT_CATALOG_NAMES['WT870P-245-40-R19'],
    sku: 'WT870P-245-40-R19',
    material: 'winter',
  },
];

export const EQUIPMENT_PRODUCT_MAP = Object.freeze(
  EQUIPMENT_PRODUCTS.reduce((products, product) => {
    products[product.sku] = product;
    return products;
  }, {}),
);

export function getEquipmentProductBySku(sku) {
  return EQUIPMENT_PRODUCT_MAP[sku] || null;
}
