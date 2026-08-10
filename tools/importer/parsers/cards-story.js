/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-story
 * Base block: cards
 * Sources:
 *   - https://www.continental-tires.com                (main .container:nth-of-type(13) → .image-list.image-list--e)
 *   - https://www.continental-tires.com/products/car/   (main .image-list.image-list--e)
 * Generated: 2026-08-10
 *
 * Library convention (cards, 2 columns, N card rows):
 *   Row 1: block name (added by createBlock).
 *   Each following row is one card:
 *     cell 1: Image (mandatory).
 *     cell 2: Text content — Title (heading), Description, CTA link at bottom.
 *   Here the story cards also carry a date, kept above the title.
 *
 * Source structure (.cmp-image-list__item):
 *   article > a.cmp-image-list__item-image-link
 *     > .cmp-image-list__item-image > img
 *     > .cmp-image-list__item-text-content
 *         > (ul.cmp-image-list__item-tags)          (optional)
 *         > span.cmp-image-list__item-date          (date)
 *         > .cmp-image-list__item-title-link > .cmp-image-list__item-title
 *         > span.cmp-image-list__item-description   (optional)
 *         > .cmp-image-list__item-read-more         ("Read more")
 * The whole card links via the wrapping <a>; that href is applied to the title
 * and to a real "Read more" link so the card destination is preserved.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-image-list__item'));
  const cells = [];

  items.forEach((item) => {
    const href = item.querySelector('.cmp-image-list__item-image-link')?.getAttribute('href')
      || item.querySelector('a')?.getAttribute('href')
      || '';

    // Image cell (image only).
    const img = item.querySelector('.cmp-image-list__item-image img, img');

    // Body content.
    const date = item.querySelector('.cmp-image-list__item-date');
    const titleText = (item.querySelector('.cmp-image-list__item-title')?.textContent || '').trim();
    const description = item.querySelector('.cmp-image-list__item-description');

    if (!titleText && !img) return;

    const body = [];
    if (date) {
      const p = document.createElement('p');
      p.textContent = (date.textContent || '').trim();
      body.push(p);
    }
    if (titleText) {
      // Represent the title as a linked heading pointing to the card destination.
      const h3 = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = titleText;
        h3.append(a);
      } else {
        h3.textContent = titleText;
      }
      body.push(h3);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = (description.textContent || '').trim();
      body.push(p);
    }
    if (href) {
      // Explicit "Read more" CTA link.
      const readMore = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = 'Read more';
      readMore.append(a);
      body.push(readMore);
    }

    // cell 1 = image only; cell 2 = card body.
    cells.push([img || '', body]);
  });

  // Bail gracefully if no cards were found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-story', cells });
  element.replaceWith(block);
}
