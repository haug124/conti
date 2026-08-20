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

  // Helper: turn a <p> whose text matches `label` into a styled CTA.
  // If the author linked the label (e.g. "[Show results](/a4?...)"), render a
  // real anchor <a class="button"> so the CTA navigates; otherwise fall back to
  // a plain (non-navigating) <button>.
  const asButton = (label, variant) => {
    const p = [...textCol.querySelectorAll('p')]
      .find((el) => el.textContent.trim().toLowerCase() === label.toLowerCase());
    if (!p) return null;
    const link = p.querySelector('a[href]');
    let cta;
    if (link) {
      cta = document.createElement('a');
      cta.href = link.getAttribute('href');
      if (link.target) cta.target = link.target;
    } else {
      cta = document.createElement('button');
      cta.type = 'button';
    }
    cta.className = `button ${variant}`.trim();
    cta.textContent = p.textContent.trim();
    p.replaceWith(cta);
    return cta;
  };

  if (shape === 'modes') {
    // Large option chooser (Search by size / Search by vehicle).
    list.classList.add('columns-teaser-options');
    listItems.forEach((li) => li.classList.add('columns-teaser-option'));
    // "Skip to results" → outlined secondary button.
    asButton('Skip to results', 'secondary');
  }

  if (shape === 'form') {
    // Tire-size dropdown values, keyed by a token found in the field label.
    // Authors keep the simple "Label (eg. value)" list; the block turns each
    // into a real <select> populated from the matching option list here.
    const range = (start, end, step) => {
      const out = [];
      for (let v = start; v <= end; v += step) out.push(String(v));
      return out;
    };
    const optionSets = [
      // search-by-size
      { key: 'width', options: range(115, 355, 10) },
      { key: 'aspect', options: ['60', '70', '80', '85', '90'] },
      { key: 'diameter', options: ['13', '14', '15', '16', '17'] },
      { key: 'speed', options: ['112T', '112V', '112W'] },
      // search-by-vehicle
      { key: 'brand', options: ['Volkswagen', 'Audi', 'Mercedes-Benz', 'BMW'] },
      { key: 'model', options: ['A4', 'A6', 'E-Class', 'C-Class', '3 Series', '5 Series', 'Golf', 'Passat'] },
      { key: 'year', options: ['2022', '2023', '2024', '2025', '2026'] },
      { key: 'version', options: ['1.6 L', '1.8 T', '1.9 TDI', '2.0 FSI', '2.4 V6', '2.5 TDI', '3.0 V6'] },
      { key: 'fitment', options: ['195/65 R 15', '205/55 R 16', '205/60 R 15', '205/65 R 15', '215/55 R 16', '235/40 R 18', '235/45 R 17'] },
    ];

    // Turn the list of "Label (eg. value)" items into label + <select> dropdown.
    list.classList.add('columns-teaser-fields');
    listItems.forEach((li) => {
      const raw = li.textContent.trim();
      const match = raw.match(/^(.*?)\s*\(\s*eg\.\s*(.*?)\s*\)\s*$/i);
      const label = match ? match[1].trim() : raw;
      li.textContent = '';
      li.classList.add('columns-teaser-field');

      const labelEl = document.createElement('span');
      labelEl.className = 'columns-teaser-field-label';
      labelEl.textContent = label;

      const select = document.createElement('select');
      select.className = 'columns-teaser-field-select';
      select.setAttribute('aria-label', label);

      // Placeholder (disabled, selected by default).
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Please select';
      placeholder.disabled = true;
      placeholder.selected = true;
      select.append(placeholder);

      const set = optionSets.find((s) => label.toLowerCase().includes(s.key));
      (set ? set.options : []).forEach((val) => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        select.append(opt);
      });

      // Grey out while showing the placeholder; switch to solid once a value
      // is chosen (see .is-placeholder in the CSS).
      select.classList.add('is-placeholder');
      select.addEventListener('change', () => {
        select.classList.toggle('is-placeholder', select.value === '');
      });

      li.append(labelEl, select);
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

    // Center a heading-only default-content block that introduces the teaser
    // rows (e.g. homepage "More about Continental Tires").
    const wrapper = block.closest('.columns-teaser-wrapper');
    const prev = wrapper?.previousElementSibling;
    if (
      prev
      && prev.classList.contains('default-content-wrapper')
      && prev.querySelector('h1, h2, h3, h4, h5, h6')
      && !prev.querySelector('p, ul, ol')
    ) {
      prev.classList.add('columns-teaser-section-heading');
    }
  }
}
