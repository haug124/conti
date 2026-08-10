/*
 * Commerce PLP import script — Continental Tires "Search Results"
 *
 * Page type: PLP (product listing page)
 * Backend: Adobe Commerce (catalog API at runtime)
 *
 * The output document is a THIN SHELL: the product grid, filters, sort controls,
 * pagination and results count are all rendered at runtime by the EDS
 * `product-list-page` block via the Adobe Commerce catalog API. The scraped
 * product cards are reference only and are NOT emitted into the document.
 *
 * Standard (authored) content preserved from the source:
 *   - The results heading group: H5 "Your Search Results" + H1 "Continental Car, 4x4 & Van Tires"
 *
 * Commerce block emitted:
 *   - product-list-page  (config: urlpath, pageSize)  — see migration-work/commerce-templates.json
 */

/* global WebImporter */

/**
 * Extract the results heading group (default content) from the source DOM.
 * Returns a document fragment holder <div> or null.
 */
function parseResultsHeading(document) {
  const heads = document.querySelectorAll('.cmp-tire-search-results-v2-results__title .cmp-title__text, h1.cmp-title__text, h5.cmp-title__text');
  if (!heads || heads.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('⚠️ parseResultsHeading: no results heading found');
    return null;
  }
  const holder = document.createElement('div');
  // Preserve source order: H5 eyebrow above H1 title.
  const seen = new Set();
  heads.forEach((h) => {
    const key = `${h.tagName}:${(h.textContent || '').trim()}`;
    if (seen.has(key)) return;
    seen.add(key);
    holder.append(h.cloneNode(true));
  });
  return holder.childNodes.length ? holder : null;
}

/**
 * Build the product-list-page commerce block as an EDS key-value block table.
 * Config comes from migration-work/commerce-templates.json.
 */
function buildProductListPageBlock(document) {
  const selectedPlpBlock = 'product-list-page';
  // urlpath: catalog category path (verify against the Adobe Commerce catalog).
  const urlpath = 'car';
  const pageSize = '9';
  return WebImporter.DOMUtils.createTable([
    [selectedPlpBlock],
    ['urlpath', urlpath],
    ['pageSize', pageSize],
  ], document);
}

export default {
  transform({ document, url, params }) {
    const main = document.body;

    // STEP 1: Extract all authored content while the DOM is still intact.
    const resultsHeading = parseResultsHeading(document);

    // Commerce block config is not DOM-dependent — safe to build now.
    const productListPageBlock = buildProductListPageBlock(document);

    // STEP 2: Clear — no DOM queries after this line.
    main.innerHTML = '';

    // STEP 3: Rebuild sections in page order.
    // Section 1: results heading (default content) above the listing.
    if (resultsHeading) {
      const headingSection = document.createElement('div');
      headingSection.append(resultsHeading);
      main.append(headingSection);
      main.append(document.createElement('hr'));
    }

    // Section 2: commerce product-list-page block (catalog-driven at runtime).
    const listingSection = document.createElement('div');
    listingSection.append(productListPageBlock);
    main.append(listingSection);

    // STEP 4: Metadata + built-in importer rules once `main` is rebuilt.
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params?.originalURL || url);

    // Strip trailing slash / .html before sanitizing so we don't emit a double extension.
    const rawPath = new URL(url).pathname.replace(/\.html?$/i, '').replace(/\/+$/, '') || '/';
    return [{ element: main, path: WebImporter.FileUtils.sanitizePath(rawPath) }];
  },
};
