/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-welcome
 * Base block: hero (single-column)
 * Sources:
 *   - https://www.continental-tires.com                 (main .stage-image.teaser)
 *   - https://www.continental-tires.com/products/car/    (main .stage-image.teaser)
 * Generated: 2026-08-10
 *
 * Library convention (hero, 1 column, 3 rows):
 *   Row 1: block name (added by createBlock).
 *   Row 2: single cell — Background Image (optional).
 *   Row 3: single cell — Title (heading), Subheading (text), Call-to-Action (link).
 *
 * Source structure (.cmp-teaser):
 *   .cmp-teaser__content > p.cmp-teaser__pretitle (homepage only, acts as subheading/eyebrow)
 *                        > h1|h2.cmp-teaser__title
 *                        > .cmp-teaser__action-container > a.cmp-teaser__action-link
 *   .cmp-teaser__image   > .cmp-image > img.cmp-image__image
 */
export default function parse(element, { document }) {
  // Pretitle is optional (present on the homepage stage, absent on car-landing).
  const pretitle = element.querySelector('p.cmp-teaser__pretitle, .cmp-teaser__pretitle');
  // Heading is H1 on the homepage and H2 on car-landing.
  const heading = element.querySelector('h1.cmp-teaser__title, h2.cmp-teaser__title, .cmp-teaser__title, h1, h2');
  // Single CTA link.
  const cta = element.querySelector('a.cmp-teaser__action-link, .cmp-teaser__action-container a, .cmp-teaser__content a');
  // Full-bleed background image.
  const bgImage = element.querySelector('.cmp-teaser__image img, img.cmp-image__image, img');

  // Bail gracefully if there is no meaningful content.
  if (!heading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  cells.push([bgImage || '']);

  // Row 3: title, subheading (pretitle) and CTA in a single cell.
  const contentCell = [];
  if (pretitle) contentCell.push(pretitle);
  if (heading) contentCell.push(heading);
  if (cta) contentCell.push(cta);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-welcome', cells });
  element.replaceWith(block);
}
