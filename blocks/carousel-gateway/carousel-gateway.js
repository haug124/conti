/**
 * carousel-gateway — horizontal tile carousel (product / vehicle-category gateway).
 *
 * Supports two authored content shapes, both rendered as a scroll-snapping,
 * swipeable row of tiles (image on top, text + link below):
 *   - Homepage vehicle categories: [image] | [h5 + p>a "Explore"]
 *   - Car-landing product tiles:    [image] | [p(eyebrow) + h5 + p(desc) + p>a "View details"]
 *
 * Navigation: prev/next arrow buttons scroll the track by one visible page.
 * Fully keyboard/touch accessible; no autoplay, no content reordering.
 */

function getScrollStep(track) {
  const slide = track.querySelector('.carousel-gateway-slide');
  if (!slide) return track.clientWidth;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.columnGap || style.gap) || 0;
  const slideWidth = slide.getBoundingClientRect().width + gap;
  // Scroll by as many whole tiles as currently fit in the viewport.
  const perPage = Math.max(1, Math.floor(track.clientWidth / slideWidth));
  return slideWidth * perPage;
}

function updateArrowState(block) {
  const track = block.querySelector('.carousel-gateway-slides');
  const prev = block.querySelector('.carousel-gateway-nav-prev');
  const next = block.querySelector('.carousel-gateway-nav-next');
  if (!track || !prev || !next) return;
  const maxScroll = track.scrollWidth - track.clientWidth - 1;
  const atStart = track.scrollLeft <= 0;
  const atEnd = track.scrollLeft >= maxScroll;
  prev.disabled = atStart;
  next.disabled = atEnd;
  // Hide the whole nav when everything already fits on screen.
  const nav = block.querySelector('.carousel-gateway-navigation-buttons');
  if (nav) nav.hidden = maxScroll <= 0;
}

function bindEvents(block) {
  const track = block.querySelector('.carousel-gateway-slides');
  const prev = block.querySelector('.carousel-gateway-nav-prev');
  const next = block.querySelector('.carousel-gateway-nav-next');

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollStep(track), behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    track.scrollBy({ left: getScrollStep(track), behavior: 'smooth' });
  });

  let raf;
  track.addEventListener('scroll', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => updateArrowState(block));
  });
  window.addEventListener('resize', () => updateArrowState(block));
}

function createSlide(row, slideIndex) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.classList.add('carousel-gateway-slide');

  const columns = row.querySelectorAll(':scope > div');
  columns.forEach((column, colIdx) => {
    column.classList.add(
      `carousel-gateway-slide-${colIdx === 0 ? 'image' : 'content'}`,
    );
    slide.append(column);
  });

  // Tag the semantic parts of the content cell so CSS can style both shapes.
  const content = slide.querySelector('.carousel-gateway-slide-content');
  if (content) {
    const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
    // Eyebrow: a text paragraph that appears before the heading and has no link.
    if (heading) {
      let node = heading.previousElementSibling;
      while (node) {
        if (node.tagName === 'P' && !node.querySelector('a')) {
          node.classList.add('carousel-gateway-eyebrow');
        }
        node = node.previousElementSibling;
      }
    }
    // CTA: the paragraph that wraps the link ("Explore" / "View details").
    const cta = content.querySelector('p:has(a)') || [...content.querySelectorAll('p')].find((p) => p.querySelector('a'));
    if (cta) cta.classList.add('carousel-gateway-cta');
  }

  return slide;
}

export default async function decorate(block) {
  const rows = Array.from(block.querySelectorAll(':scope > div'));

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  // Pull the preceding default-content headings (e.g. "Discover the range /
  // of Continental Tires") into the block so they can be overlaid, centered,
  // in front of the background image — matching the source layout.
  const heading = document.createElement('div');
  heading.classList.add('carousel-gateway-heading');
  const prev = block.closest('.carousel-gateway-wrapper')?.previousElementSibling;
  if (prev && prev.classList.contains('default-content-wrapper') && prev.querySelector('h1, h2, h3, h4, h5, h6')) {
    while (prev.firstChild) heading.append(prev.firstChild);
    prev.remove();
  }

  const container = document.createElement('div');
  container.classList.add('carousel-gateway-slides-container');
  if (heading.childNodes.length) container.append(heading);

  const track = document.createElement('ul');
  track.classList.add('carousel-gateway-slides');
  track.setAttribute('aria-label', 'Tiles');

  rows.forEach((row, idx) => {
    track.append(createSlide(row, idx));
    row.remove();
  });

  container.append(track);
  block.append(container);

  // Prev / next navigation arrows.
  const nav = document.createElement('div');
  nav.classList.add('carousel-gateway-navigation-buttons');
  nav.innerHTML = `
    <button type="button" class="carousel-gateway-nav-prev" aria-label="Previous"></button>
    <button type="button" class="carousel-gateway-nav-next" aria-label="Next"></button>
  `;
  container.append(nav);

  bindEvents(block);
  // Set initial arrow enabled/disabled + visibility once layout is settled.
  requestAnimationFrame(() => updateArrowState(block));
  // Recompute once images load, since track scrollWidth depends on their size.
  block.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', () => updateArrowState(block), { once: true });
  });
}
