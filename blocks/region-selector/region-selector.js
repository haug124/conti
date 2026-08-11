/**
 * Region / location selector block.
 *
 * Expected authored structure (one locale per row):
 *   | region-selector                          |
 *   | Germany            | /de/de/             |
 *   | United Kingdom     | /gb/en/             |
 *   | USA (English)      | /us/en/             |
 *   | ...                | ...                 |
 *
 * The first cell of each row is the visible label, the second cell holds the
 * target path (as text or as a link). An optional single-cell first row may be
 * used as the placeholder / button label (e.g. "Visit local website").
 *
 * Renders a labelled <select> plus a "Visit local website" button that
 * navigates to the selected locale.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Center the heading that precedes this block (authored as default content).
  const wrapper = block.closest('.region-selector-wrapper');
  const prevHeadingWrapper = wrapper?.previousElementSibling;
  if (
    prevHeadingWrapper
    && prevHeadingWrapper.classList.contains('default-content-wrapper')
    && prevHeadingWrapper.querySelector('h1, h2, h3, h4, h5, h6')
  ) {
    prevHeadingWrapper.classList.add('region-selector-heading');
  }

  const rows = [...block.children];
  const options = [];
  const buttonLabel = 'Visit local website';
  let placeholder = 'Select your location';

  rows.forEach((row) => {
    const cells = [...row.children];
    // Config row: a single cell that is not a locale pair overrides labels.
    if (cells.length === 1) {
      const text = cells[0].textContent.trim();
      if (text) placeholder = text;
      return;
    }
    const label = cells[0]?.textContent.trim();
    const link = cells[1]?.querySelector('a');
    const href = link ? link.getAttribute('href') : cells[1]?.textContent.trim();
    if (label && href) options.push({ label, href });
  });

  const fieldId = `region-selector-${Math.random().toString(36).slice(2, 8)}`;

  const select = document.createElement('select');
  select.className = 'region-selector-dropdown';
  select.id = fieldId;
  select.setAttribute('aria-label', placeholder);

  const placeholderOption = document.createElement('option');
  placeholderOption.value = '';
  placeholderOption.textContent = placeholder;
  placeholderOption.selected = true;
  select.append(placeholderOption);

  options.forEach(({ label, href }) => {
    const option = document.createElement('option');
    option.value = href;
    option.textContent = label;
    select.append(option);
  });

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'region-selector-button';
  button.textContent = buttonLabel;
  button.disabled = true;

  select.addEventListener('change', () => {
    button.disabled = !select.value;
  });

  button.addEventListener('click', () => {
    if (select.value) window.location.href = select.value;
  });

  block.replaceChildren(select, button);
}
