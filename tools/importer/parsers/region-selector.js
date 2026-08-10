/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: region-selector  (custom block, homepage only)
 * Base block: region-selector
 * Source: https://www.continental-tires.com  (main .container:nth-of-type(4) → .user-guidance-inpage)
 * Generated: 2026-08-10
 *
 * Block contract (see blocks/region-selector/region-selector.js — authoritative):
 *   Row 1: block name (added by createBlock).
 *   Optional single-cell row: overrides the placeholder / select label.
 *   Each locale row: 2 cells → | Label | /locale/path |
 *                    (cell 2 may be a link or a plain-text path).
 *   The "Visit local website" button label is HARD-CODED by the block and is not
 *   read from content, so no row is emitted for it.
 *
 * Source structure (.cmp-user-guidance-inpage):
 *   > h2                                   section heading (externalized as default content)
 *   > .dropdown
 *       > .dropdown__filter-selected       placeholder text ("Select your location")
 *       > ul.dropdown__select ...
 *           > li.dropdown__select-option   one per locale (LABEL text only)
 *   > .button > button > .cmp-button__text "Visit local website"
 *
 * ⚠️ HUMAN REVIEW REQUIRED: the scraped DOM contains locale LABELS only — the
 * original site resolves each target path at runtime via JS, so no hrefs/paths
 * exist in the source. Each locale row is therefore emitted with an EMPTY path
 * cell; an author must populate the target paths for the switcher to function.
 */
export default function parse(element, { document }) {
  // Section heading above the selector — preserved as default content before the block.
  const heading = element.querySelector('.cmp-user-guidance-inpage > h2, h2');

  // Placeholder / select label (config row).
  const placeholderEl = element.querySelector('.dropdown__filter-selected');
  const placeholderText = placeholderEl ? (placeholderEl.textContent || '').trim() : '';

  // Locale option labels.
  const optionEls = Array.from(element.querySelectorAll('.dropdown__select-option'));

  const cells = [];

  // Optional config row: overrides the placeholder / aria-label.
  if (placeholderText) cells.push([placeholderText]);

  // One row per locale: | Label | path | (path unknown in source → left empty).
  optionEls.forEach((opt) => {
    const label = (opt.textContent || '').trim();
    if (!label) return;
    cells.push([label, '']);
  });

  // Bail gracefully if no locale options were found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'region-selector', cells });

  // Emit the section heading (if any) as default content before the selector block.
  if (heading) {
    element.replaceWith(heading, block);
  } else {
    element.replaceWith(block);
  }
}
