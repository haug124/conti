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

  // "See stories" call-to-action below the grid (matches the source homepage,
  // which closes the stories section with a bordered CTA linking to /about-us/stories/).
  const ctaWrapper = document.createElement('p');
  ctaWrapper.className = 'cards-story-cta';
  const cta = document.createElement('a');
  cta.href = '/about-us/stories/';
  cta.textContent = 'See stories';
  ctaWrapper.append(cta);
  block.append(ctaWrapper);
}
