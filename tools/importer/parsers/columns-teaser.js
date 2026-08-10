/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-teaser
 * Base block: columns (2 columns, 1 content row: text | image, order reversible)
 * Sources (5 templates, several distinct source shapes handled here):
 *   1. homepage       — main .container:nth-of-type(8|10|12)  → .text-and-image teaser row
 *   2. car-landing    — main .product-hero-teaser              → product teaser (bg image + name + desc + CTA)
 *   3. product-search — main .tiresearch                       → static search-mode chooser form
 *   4. search-by-size — main .tiresearchbysize                 → static tire-size form
 *   5. search-by-vehicle — main .tiresearchbyvehicle           → static vehicle-selection form
 * Generated: 2026-08-10
 *
 * Library convention (columns): first row is the block name; the second row
 * defines the columns. Here each instance is a single 2-column row: cell 1 = text
 * content (heading, paragraphs, CTA), cell 2 = image. columns-teaser.js flips
 * ordering so either column may hold the image.
 *
 * The tire-search forms (shapes 3-5) are modeled as STATIC text beside the image,
 * with NO interactivity: headings, instructions, and labeled fields/options are
 * captured as plain text/lists. Buttons become their label text (no <button>).
 */

/** Build the tire-search static text cell (shapes 3-5). */
function buildTireSearchTextCell(element, document) {
  const textCell = [];

  // Headings / eyebrow / question / instructions — order preserved as authored.
  const heads = element.querySelectorAll(
    '.content__pretitle, .content__title, .title-row .title, h1.title, h2.question, .question, p.description, .description',
  );
  heads.forEach((h) => textCell.push(h));

  // Search-mode chooser options (product-search): "Search by size" / "Search by vehicle".
  const modeButtons = Array.from(element.querySelectorAll('.content__list .list__item-button'));
  if (modeButtons.length) {
    const ul = document.createElement('ul');
    modeButtons.forEach((btn) => {
      const li = document.createElement('li');
      li.textContent = (btn.textContent || '').trim();
      ul.append(li);
    });
    textCell.push(ul);
  }

  // Labeled form fields (search-by-size / search-by-vehicle): capture each
  // field's label + example placeholder as a static line.
  const fields = Array.from(
    element.querySelectorAll(
      '.cmp-tire-search-v2-size-selector__field, .cmp-tire-search-by-vehicle-step__field',
    ),
  );
  if (fields.length) {
    const ul = document.createElement('ul');
    fields.forEach((field) => {
      const label = field.querySelector('label');
      const placeholder = field.querySelector('.select__placeholder');
      const labelText = label ? (label.textContent || '').trim() : '';
      const phText = placeholder ? (placeholder.textContent || '').trim() : '';
      if (!labelText && !phText) return;
      const li = document.createElement('li');
      li.textContent = phText ? `${labelText} (${phText})` : labelText;
      ul.append(li);
    });
    if (ul.childElementCount) textCell.push(ul);
  }

  // Control buttons (Back / Show results / Skip to results) → static label paragraphs.
  const controls = Array.from(
    element.querySelectorAll(
      '.button-wrapper button, .content__button-container .cmp-button__text, .show-results .cmp-button__text',
    ),
  );
  const seen = new Set();
  controls.forEach((ctrl) => {
    const text = (ctrl.textContent || '').trim();
    if (!text || seen.has(text)) return;
    seen.add(text);
    const p = document.createElement('p');
    p.textContent = text;
    textCell.push(p);
  });

  return textCell;
}

export default function parse(element, { document }) {
  const isTireSearch = element.matches('.tiresearch, .tiresearchbysize, .tiresearchbyvehicle')
    || element.querySelector('.cmp-tire-search, .cmp-tire-search-by-size, .cmp-tire-search-by-vehicle');
  const isProductHeroTeaser = element.matches('.product-hero-teaser')
    || element.querySelector('.cmp-product-hero-teaser');

  let textCell;
  let image;

  if (isTireSearch) {
    // Shapes 3-5: static tire-search form.
    textCell = buildTireSearchTextCell(element, document);
    image = element.querySelector(
      '.cmp-tire-search__image, .cmp-tire-search-v2-size-selector__tire-search-image img, .cmp-tire-search-by-vehicle-step__image img, img',
    );
  } else if (isProductHeroTeaser) {
    // Shape 2: product hero teaser (car-landing).
    textCell = [];
    const name = element.querySelector('.cmp-product-hero-teaser__name h1, .cmp-product-hero-teaser__name h2, .cmp-product-hero-teaser__name h3, .cmp-product-hero-teaser__name h4, .cmp-product-hero-teaser__name h5, .cmp-product-hero-teaser__name .cmp-title__text');
    const desc = element.querySelector('.cmp-product-hero-teaser__description h1, .cmp-product-hero-teaser__description h2, .cmp-product-hero-teaser__description h3, .cmp-product-hero-teaser__description h4, .cmp-product-hero-teaser__description h5, .cmp-product-hero-teaser__description .cmp-title__text');
    const bestSelling = element.querySelector('.cmp-product-hero-teaser__best-selling');
    const cta = element.querySelector('.cmp-product-hero-teaser__content a, .button a, a');
    if (bestSelling) textCell.push(bestSelling);
    if (name) textCell.push(name);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);
    // Prefer the product image; fall back to the background image.
    image = element.querySelector('.cmp-product-hero-teaser__productimage, .cmp-product-hero-teaser__image, img');
  } else {
    // Shape 1: standard text-and-image teaser row (homepage).
    // The matched .container wraps a single .text-and-image with a .text and .image column.
    const textCol = element.querySelector('.text .cmp-text, .cmp-text, .text');
    textCell = [];
    if (textCol) {
      // Push the meaningful children (heading, paragraphs incl. the Read more link).
      Array.from(textCol.children).forEach((child) => textCell.push(child));
      if (textCell.length === 0) textCell.push(textCol);
    }
    image = element.querySelector('.image img, .cmp-image img, img');
  }

  // Determine whether we actually captured meaningful content. Positional
  // (nth-of-type) instance selectors can resolve to an empty structural
  // container on the live DOM; in that case unwrap instead of emitting an
  // empty block table.
  const hasText = Array.isArray(textCell)
    && textCell.some((node) => node && (node.textContent || '').trim().length > 0);
  const hasImage = !!(image && (image.getAttribute('src') || image.querySelector?.('img')));

  if (!hasText && !hasImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 2-column row: text | image. Pad with empty cell if one side is missing.
  const cells = [[hasText ? textCell : '', hasImage ? image : '']];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-teaser', cells });
  element.replaceWith(block);
}
