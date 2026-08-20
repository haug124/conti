/**
 * Bodea Dashboard – Low Stock Alert Panel
 *
 * Renders the "Low Stock Alert" card with a list of equipment items
 * whose inventory is at or below the configured threshold.
 *
 * DATA:
 * - Product stock_status: real Commerce data (IN_STOCK / OUT_OF_STOCK)
 * - Qty: real if stock_item.qty or only_x_left_in_stock available; otherwise
 *   renders stock_status badge only and documents the limitation.
 * - Products showing: only items flagged as low/out of stock (filtered from real product query)
 *
 * See dashboard-service.js → normaliseProduct() for full qty resolution logic.
 */

import { getCodeAssetUrl } from '../../scripts/commerce.js';

/* ── Demo low-stock tire (fake) ────────────────────────────────────────────
   The live Commerce catalog belongs to a different demo (bricks), so the Low
   Stock Alert would surface an unrelated SKU. For this Continental demo we show
   a fixed tire product instead of the live stock data. */
const DEMO_TIRE = {
  name: 'AllSeasonContact 2 – 205/55 R16',
  image: getCodeAssetUrl('/images/tire-allseasoncontact.png'),
  qty: 120,
  capacity: 500,
};

/* ── Progress bar colour logic ─────────────────────────────────────────── */

function getStockBarVariant(ratio) {
  if (ratio > 0.5) return 'good';
  if (ratio > 0.25) return 'warning';
  return 'critical';
}

/* ── Skeleton ──────────────────────────────────────────────────────────── */

function buildSkeletonItem() {
  const li = document.createElement('li');
  li.className = 'stock-item stock-item--skeleton';
  li.innerHTML = `
    <div class="stock-item__icon">
      <div class="skeleton-block" style="width:32px;height:32px;border-radius:6px"></div>
    </div>
    <div class="stock-item__details">
      <div class="skeleton-line" style="width:65%;height:14px;margin-bottom:6px"></div>
      <div class="skeleton-line" style="width:45%;height:12px;margin-bottom:8px"></div>
      <div class="skeleton-line" style="width:100%;height:6px;border-radius:3px"></div>
    </div>
  `;
  return li;
}

/* ── Panel header ──────────────────────────────────────────────────────── */

function buildPanelHeader() {
  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `
    <h2 class="panel-header__title">Low Stock Alert</h2>
    <div class="panel-header__dots">
      <span class="panel-header__dot panel-header__dot--active"></span>
      <span class="panel-header__dot"></span>
      <span class="panel-header__dot"></span>
    </div>
  `;
  return header;
}

/* ── Public API ────────────────────────────────────────────────────────── */

/**
 * Build the Low Stock Alert panel with skeleton loading state.
 * @returns {HTMLElement}
 */
export function buildStockSection() {
  const section = document.createElement('section');
  section.className = 'dashboard-panel dashboard-stock';
  section.id = 'low-stock';
  section.setAttribute('aria-label', 'Low stock alerts');

  section.appendChild(buildPanelHeader());

  const list = document.createElement('ul');
  list.className = 'stock-list stock-list--loading';
  list.setAttribute('role', 'list');

  for (let i = 0; i < 3; i += 1) {
    list.appendChild(buildSkeletonItem());
  }

  section.appendChild(list);
  return section;
}

/**
 * Replace skeleton with real low-stock product data.
 * Shows only items that are below the threshold or OUT_OF_STOCK.
 * If all items are well-stocked, shows a positive "all good" state.
 *
 * @param {HTMLElement} section
 * @param {object[]|null} stockData - from DashboardService.fetchEquipmentStock()
 */
export function updateStockSection(section) {
  const list = section.querySelector('.stock-list');
  if (!list) return;

  list.innerHTML = '';
  list.classList.remove('stock-list--loading');

  /* Demo: always show the fixed Continental tire as the low-stock item
     instead of the live (bricks) Commerce catalog. */
  const ratio = Math.min(DEMO_TIRE.qty / DEMO_TIRE.capacity, 1);
  const pct = Math.round(ratio * 100);
  const variant = getStockBarVariant(ratio);

  const li = document.createElement('li');
  li.className = 'stock-item';
  li.innerHTML = `
    <div class="stock-item__icon">
      <img src="${DEMO_TIRE.image}" alt="${DEMO_TIRE.name}" width="32" height="32"
        style="width:32px;height:32px;object-fit:contain;border-radius:6px" />
    </div>
    <div class="stock-item__details">
      <div class="stock-item__header">
        <span class="stock-item__name">${DEMO_TIRE.name}</span>
        <span class="stock-item__badge stock-item__badge--low">Low Stock</span>
      </div>
      <div class="stock-item__qty">~${DEMO_TIRE.qty.toLocaleString()} units / ${DEMO_TIRE.capacity.toLocaleString()} cap.</div>
      <div class="stock-item__bar-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${DEMO_TIRE.name} stock level ${pct}%">
        <div class="stock-item__bar-fill stock-item__bar-fill--${variant}" style="width:${pct}%"></div>
      </div>
    </div>
  `;
  list.appendChild(li);

  /* Manage Inventory link */
  const footer = document.createElement('li');
  footer.className = 'stock-footer';
  footer.innerHTML = `
    <a href="/customer/account" class="stock-footer__link">Manage Inventory</a>
  `;
  list.appendChild(footer);
}
