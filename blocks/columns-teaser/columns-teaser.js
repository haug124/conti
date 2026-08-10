/**
 * columns-teaser
 *
 * A Continental "text | image" teaser block that supports several shapes that
 * all share the same markup contract (2 cells: text + image):
 *   - teaser  : heading + paragraph + "Read more" link | image
 *               (homepage "Our Company" / "Sustainability" / "Technology" rows)
 *   - modes   : eyebrow + H1 + option list + "Skip to results" | image
 *               (product-search mode chooser)
 *   - form    : eyebrow + heading + instructions + labelled fields
 *               + Back / Show results | image or diagram
 *               (search-by-size, search-by-vehicle static forms)
 *
 * The shape is detected from the authored content so a single block/CSS pair
 * styles every instance.
 *
 * @param {Element} block the columns-teaser block element
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;

  const cols = [...firstRow.children];
  block.classList.add(`columns-teaser-${cols.length}-cols`);

  // --- Mark image / text columns --------------------------------------------
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        col.classList.add('columns-teaser-img-col');
      } else if (col.textContent.trim() || col.querySelector('*')) {
        col.classList.add('columns-teaser-text-col');
      }
    });
  });

  const textCol = block.querySelector('.columns-teaser-text-col') || cols[0];

  // --- Detect the shape ------------------------------------------------------
  const list = textCol.querySelector('ul');
  const listItems = list ? [...list.querySelectorAll('li')] : [];
  const isForm = listItems.some((li) => /\(eg\./i.test(li.textContent));
  let shape = 'teaser';
  if (isForm) shape = 'form';
  else if (list) shape = 'modes';
  block.classList.add(`columns-teaser--${shape}`);

  // Helper: turn a plain <p> whose text matches `label` into a styled button.
  const asButton = (label, variant) => {
    const p = [...textCol.querySelectorAll('p')]
      .find((el) => el.textContent.trim().toLowerCase() === label.toLowerCase());
    if (!p) return null;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `button ${variant}`.trim();
    btn.textContent = p.textContent.trim();
    p.replaceWith(btn);
    return btn;
  };

  if (shape === 'modes') {
    // Large option chooser (Search by size / Search by vehicle).
    list.classList.add('columns-teaser-options');
    listItems.forEach((li) => li.classList.add('columns-teaser-option'));
    // "Skip to results" → outlined secondary button.
    asButton('Skip to results', 'secondary');
  }

  if (shape === 'form') {
    // Turn the list of "Label (eg. value)" items into label + faux input boxes.
    list.classList.add('columns-teaser-fields');
    listItems.forEach((li) => {
      const raw = li.textContent.trim();
      const match = raw.match(/^(.*?)\s*\(\s*eg\.\s*(.*?)\s*\)\s*$/i);
      const label = match ? match[1].trim() : raw;
      const placeholder = match ? `eg. ${match[2].trim()}` : '';
      li.textContent = '';
      li.classList.add('columns-teaser-field');
      const labelEl = document.createElement('span');
      labelEl.className = 'columns-teaser-field-label';
      labelEl.textContent = label;
      const boxEl = document.createElement('span');
      boxEl.className = 'columns-teaser-field-box';
      boxEl.textContent = placeholder;
      boxEl.setAttribute('aria-hidden', 'true');
      li.append(labelEl, boxEl);
    });

    // Back (secondary) + Show results (primary orange), grouped in an actions row.
    const back = asButton('Back', 'secondary');
    const show = asButton('Show results', 'primary');
    if (back || show) {
      const actions = document.createElement('div');
      actions.className = 'columns-teaser-actions';
      const anchor = (back || show);
      anchor.parentNode.insertBefore(actions, anchor);
      if (back) actions.append(back);
      if (show) actions.append(show);
    }
  }

  if (shape === 'teaser') {
    // Alternate image side on desktop for consecutive teaser rows,
    // mirroring the source (row 1 text-left, row 2 image-left, ...).
    const teasers = [...document.querySelectorAll('.columns-teaser--teaser')];
    const idx = teasers.indexOf(block);
    if (idx > 0 && idx % 2 === 1) block.classList.add('columns-teaser--reverse');
  }
}
