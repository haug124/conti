/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroWelcomeParser from './parsers/hero-welcome.js';
import carouselGatewayParser from './parsers/carousel-gateway.js';
import columnsTeaserParser from './parsers/columns-teaser.js';
import cardsStoryParser from './parsers/cards-story.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import regionSelectorParser from './parsers/region-selector.js';

// TRANSFORMER IMPORTS
import contiCleanupTransformer from './transformers/conti-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-welcome': heroWelcomeParser,
  'carousel-gateway': carouselGatewayParser,
  'columns-teaser': columnsTeaserParser,
  'cards-story': cardsStoryParser,
  'cards-feature': cardsFeatureParser,
  'region-selector': regionSelectorParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  contiCleanupTransformer,
];

// PAGE TEMPLATES — standard-content Continental pages (the commerce PLP
// search-results page is handled separately by commerce-import.js).
// Keyed lookup is by URL pathname so a single script serves every template.
const PAGE_TEMPLATES = [
  {
    name: 'homepage',
    urls: ['https://www.continental-tires.com'],
    blocks: [
      { name: 'hero-welcome', instances: ['main .stage-image.teaser'] },
      { name: 'carousel-gateway', instances: ['main .product-area-gateway'] },
      { name: 'region-selector', instances: ['main .container:nth-of-type(4)'] },
      {
        name: 'columns-teaser',
        instances: [
          'main .container:nth-of-type(8)',
          'main .container:nth-of-type(10)',
          'main .container:nth-of-type(12)',
        ],
      },
      { name: 'cards-story', instances: ['main .container:nth-of-type(13)'] },
    ],
  },
  {
    name: 'car-landing',
    urls: ['https://www.continental-tires.com/products/car/'],
    blocks: [
      { name: 'hero-welcome', instances: ['main .stage-image.teaser'] },
      {
        name: 'cards-feature',
        instances: ['main .image-list.image-list--a', 'main .image-list.image-list--d'],
      },
      { name: 'carousel-gateway', instances: ['main .product-highlighting-cards'] },
      { name: 'columns-teaser', instances: ['main .product-hero-teaser'] },
      { name: 'cards-story', instances: ['main .image-list.image-list--e'] },
    ],
  },
  {
    name: 'product-search',
    urls: ['https://www.continental-tires.com/products/car/product-search/'],
    blocks: [
      { name: 'columns-teaser', instances: ['main .tiresearch'] },
    ],
  },
  {
    name: 'search-by-size',
    urls: ['https://www.continental-tires.com/products/car/product-search/search-by-size/'],
    blocks: [
      { name: 'columns-teaser', instances: ['main .tiresearchbysize'] },
    ],
  },
  {
    name: 'search-by-vehicle',
    urls: ['https://www.continental-tires.com/products/car/product-search/search-by-vehicle/'],
    blocks: [
      { name: 'columns-teaser', instances: ['main .tiresearchbyvehicle'] },
    ],
  },
];

/**
 * Normalize a URL to its pathname (no trailing slash) for template matching.
 */
function normalizePath(u) {
  try {
    return new URL(u).pathname.replace(/\/+$/, '') || '/';
  } catch (e) {
    return u;
  }
}

/**
 * Select the template whose URL matches the current page.
 */
function selectTemplate(url) {
  const path = normalizePath(url);
  return PAGE_TEMPLATES.find((t) => t.urls.some((u) => normalizePath(u) === path)) || null;
}

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload, template) {
  const enhancedPayload = { ...payload, template };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all block instances on the page based on the matched template.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances for template "${template.name}"`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;
    const main = document.body;

    const sourceUrl = (params && params.originalURL) || url;
    const template = selectTemplate(sourceUrl);

    if (!template) {
      console.warn(`No standard template matched for ${sourceUrl} — applying cleanup only.`);
    }

    // 1. beforeTransform cleanup (strips consent/accessiBe/geo-banner chrome).
    executeTransformers('beforeTransform', main, payload, template);

    // 2. Discover + parse blocks (parsers replace nodes in place).
    if (template) {
      const pageBlocks = findBlocksOnPage(document, template);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return; // already replaced by an earlier parser
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
    }

    // 3. afterTransform cleanup (strips header/footer XF, breadcrumb, loader).
    executeTransformers('afterTransform', main, payload, template);

    // 4. WebImporter built-in rules.
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, sourceUrl);

    // 5. Sanitized da document path. Map the root URL to `/index`
    //    (empty path crashes the bundled importer's path polyfill).
    const rawPath = normalizePath(sourceUrl).replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(
      rawPath === '' || rawPath === '/' ? '/index' : `${rawPath}/index`,
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: template ? template.name : 'unmatched',
        blocks: template ? template.blocks.map((b) => b.name) : [],
      },
    }];
  },
};
