/**
 * hero-welcome — full-bleed welcome stage.
 * Authored structure:
 *   row 1: [ <picture> ]                     -> background image
 *   row 2: [ <p>pretitle</p><h1/><p><a/></p> ] -> overlaid content
 *
 * EDS note: this project's decorateButtons() only turns a link into a
 * `.button` when it is wrapped in <strong>/<em>. The welcome CTA is a plain
 * link, so we add the `.button` class here to get the branded orange CTA.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const hasImage = !!block.querySelector(':scope > div:first-child picture');

  if (!hasImage) {
    block.classList.add('no-image');
  } else {
    rows[0].classList.add('hero-welcome-image');
  }

  const contentRow = rows[rows.length - 1];
  if (contentRow && (!hasImage || contentRow !== rows[0])) {
    contentRow.classList.add('hero-welcome-content');

    // Promote the plain CTA link to a branded button.
    const cta = contentRow.querySelector('a');
    if (cta && !cta.classList.contains('button')) {
      cta.classList.add('button');
      cta.title = cta.title || cta.textContent;
      const p = cta.closest('p');
      if (p) p.classList.add('button-wrapper');
    }

    // Tag the pretitle paragraph ("Welcome to") for distinct styling.
    const pretitle = contentRow.querySelector('p:not(.button-wrapper)');
    if (pretitle) pretitle.classList.add('hero-welcome-pretitle');
  }
}
