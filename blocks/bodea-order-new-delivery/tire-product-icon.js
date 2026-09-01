/**
 * Continental tire icon (tyre + rim), tinted by season category.
 * Shared by bodea-order-new-delivery wizard and bodea-orders-list product previews.
 *
 * @param {string} season all-season | summer | winter
 * @param {{ className?: string }} [opts]
 * @returns {string} SVG markup
 */
export function renderTireProductIcon(season, opts = {}) {
  const { className } = opts;
  // Rim accent colour per season.
  const colors = {
    'all-season': '#0d9488', // teal
    summer: '#ea580c', // conti-orange-ish
    winter: '#2563eb', // blue
  };
  const rim = colors[season] || colors['all-season'];
  const tire = '#1f2937'; // dark rubber
  const tread = 'rgb(255 255 255 / 22%)';
  const classAttr = className ? ` class="${className}"` : '';
  return `<svg${classAttr} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="16" cy="16" r="15" fill="${tire}"/>
    <circle cx="16" cy="16" r="15" fill="none" stroke="rgb(0 0 0 / 30%)" stroke-width="1"/>
    <g stroke="${tread}" stroke-width="1.2">
      <line x1="16" y1="1.5" x2="16" y2="4.5"/>
      <line x1="16" y1="27.5" x2="16" y2="30.5"/>
      <line x1="1.5" y1="16" x2="4.5" y2="16"/>
      <line x1="27.5" y1="16" x2="30.5" y2="16"/>
      <line x1="6" y1="6" x2="8.1" y2="8.1"/>
      <line x1="23.9" y1="23.9" x2="26" y2="26"/>
      <line x1="26" y1="6" x2="23.9" y2="8.1"/>
      <line x1="8.1" y1="23.9" x2="6" y2="26"/>
    </g>
    <circle cx="16" cy="16" r="9" fill="${rim}" opacity="0.16"/>
    <circle cx="16" cy="16" r="9" fill="none" stroke="${rim}" stroke-width="1.6"/>
    <g fill="${rim}">
      <circle cx="16" cy="16" r="2.6"/>
      <rect x="15.2" y="7.6" width="1.6" height="6" rx="0.8"/>
      <rect x="15.2" y="18.4" width="1.6" height="6" rx="0.8"/>
      <rect x="7.6" y="15.2" width="6" height="1.6" rx="0.8"/>
      <rect x="18.4" y="15.2" width="6" height="1.6" rx="0.8"/>
    </g>
  </svg>`;
}
