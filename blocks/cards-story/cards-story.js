import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-story-card-image';
      else div.className = 'cards-story-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);

  // The homepage "Trending Stories" grid has no authored heading directly above
  // it, whereas the car-landing grid does ("Our smart tips" / "Find the right
  // answer…") and provides its own CTA. Only decorate the homepage variant with
  // the section heading + "See stories" CTA, so both match the source exactly.
  const wrapper = block.closest('.cards-story-wrapper') || block.parentElement;
  const prev = wrapper?.previousElementSibling;
  const hasAuthoredHeadingAbove = !!(
    prev
    && prev.classList.contains('default-content-wrapper')
    && prev.querySelector('h1, h2, h3, h4, h5, h6')
  );

  if (!hasAuthoredHeadingAbove) {
    // Section heading above the grid: "Trending Stories" (bold) +
    // "Experience Continental for yourself" (normal weight) — matches source.
    const heading = document.createElement('div');
    heading.className = 'cards-story-heading';
    const title = document.createElement('h2');
    title.className = 'cards-story-heading-title';
    title.textContent = 'Trending Stories';
    const subtitle = document.createElement('p');
    subtitle.className = 'cards-story-heading-subtitle';
    subtitle.textContent = 'Experience Continental for yourself';
    heading.append(title, subtitle);
    block.prepend(heading);

    // "See stories" call-to-action below the grid (bordered box linking to
    // the stories overview, matching the source homepage).
    const ctaWrapper = document.createElement('p');
    ctaWrapper.className = 'cards-story-cta';
    const cta = document.createElement('a');
    cta.href = '/about-us/stories/';
    cta.textContent = 'See stories';
    ctaWrapper.append(cta);
    block.append(ctaWrapper);
  }
}
