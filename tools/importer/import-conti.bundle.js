/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-conti.js
  var import_conti_exports = {};
  __export(import_conti_exports, {
    default: () => import_conti_default
  });

  // tools/importer/parsers/hero-welcome.js
  function parse(element, { document }) {
    const pretitle = element.querySelector("p.cmp-teaser__pretitle, .cmp-teaser__pretitle");
    const heading = element.querySelector("h1.cmp-teaser__title, h2.cmp-teaser__title, .cmp-teaser__title, h1, h2");
    const cta = element.querySelector("a.cmp-teaser__action-link, .cmp-teaser__action-container a, .cmp-teaser__content a");
    const bgImage = element.querySelector(".cmp-teaser__image img, img.cmp-image__image, img");
    if (!heading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([bgImage || ""]);
    const contentCell = [];
    if (pretitle) contentCell.push(pretitle);
    if (heading) contentCell.push(heading);
    if (cta) contentCell.push(cta);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-welcome", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-gateway.js
  function parse2(element, { document }) {
    const headingEls = Array.from(
      element.querySelectorAll(
        ".cmp-product-area-gateway__heading-container > *, .cmp-product-highlighting-cards--title"
      )
    );
    let slideEls = Array.from(
      element.querySelectorAll(
        ":scope .cmp-product-area-gateway__slide-wrapper, :scope .cmp-product-highlighting-cards__product-card-wrapper"
      )
    );
    if (slideEls.length === 0) {
      slideEls = Array.from(
        element.querySelectorAll(
          ":scope .cmp-product-area-gateway__slide, :scope .cmp-product-highlighting-cards__product-card"
        )
      );
    }
    const cells = [];
    slideEls.forEach((slide) => {
      const image = slide.querySelector(
        ".cmp-product-area-gateway__slide-image-container img, .cmp-product-highlighting-cards__product-card--image img, .cmp-image img, img"
      );
      const eyebrow = slide.querySelector(".cmp-product-highlighting-cards__product-card--label");
      const title = slide.querySelector(
        ".cmp-product-area-gateway__slide-title, .cmp-product-highlighting-cards__product-card--title, h5, h4, h3"
      );
      const description = slide.querySelector(".cmp-product-highlighting-cards__product-card--description");
      const link = slide.querySelector(
        ".cmp-product-area-gateway__slide-link, .cmp-product-highlighting-cards__product-card--details-cta, a"
      );
      if (!title && !image) return;
      const contentCell = [];
      if (eyebrow) contentCell.push(eyebrow);
      if (title) contentCell.push(title);
      if (description) contentCell.push(description);
      if (link) contentCell.push(link);
      cells.push([image || "", contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-gateway", cells });
    element.replaceWith(...headingEls, block);
  }

  // tools/importer/parsers/columns-teaser.js
  function buildTireSearchTextCell(element, document) {
    const textCell = [];
    const heads = element.querySelectorAll(
      ".content__pretitle, .content__title, .title-row .title, h1.title, h2.question, .question, p.description, .description"
    );
    heads.forEach((h) => textCell.push(h));
    const modeButtons = Array.from(element.querySelectorAll(".content__list .list__item-button"));
    if (modeButtons.length) {
      const ul = document.createElement("ul");
      modeButtons.forEach((btn) => {
        const li = document.createElement("li");
        li.textContent = (btn.textContent || "").trim();
        ul.append(li);
      });
      textCell.push(ul);
    }
    const fields = Array.from(
      element.querySelectorAll(
        ".cmp-tire-search-v2-size-selector__field, .cmp-tire-search-by-vehicle-step__field"
      )
    );
    if (fields.length) {
      const ul = document.createElement("ul");
      fields.forEach((field) => {
        const label = field.querySelector("label");
        const placeholder = field.querySelector(".select__placeholder");
        const labelText = label ? (label.textContent || "").trim() : "";
        const phText = placeholder ? (placeholder.textContent || "").trim() : "";
        if (!labelText && !phText) return;
        const li = document.createElement("li");
        li.textContent = phText ? `${labelText} (${phText})` : labelText;
        ul.append(li);
      });
      if (ul.childElementCount) textCell.push(ul);
    }
    const controls = Array.from(
      element.querySelectorAll(
        ".button-wrapper button, .content__button-container .cmp-button__text, .show-results .cmp-button__text"
      )
    );
    const seen = /* @__PURE__ */ new Set();
    controls.forEach((ctrl) => {
      const text = (ctrl.textContent || "").trim();
      if (!text || seen.has(text)) return;
      seen.add(text);
      const p = document.createElement("p");
      p.textContent = text;
      textCell.push(p);
    });
    return textCell;
  }
  function parse3(element, { document }) {
    var _a;
    const isTireSearch = element.matches(".tiresearch, .tiresearchbysize, .tiresearchbyvehicle") || element.querySelector(".cmp-tire-search, .cmp-tire-search-by-size, .cmp-tire-search-by-vehicle");
    const isProductHeroTeaser = element.matches(".product-hero-teaser") || element.querySelector(".cmp-product-hero-teaser");
    let textCell;
    let image;
    if (isTireSearch) {
      textCell = buildTireSearchTextCell(element, document);
      image = element.querySelector(
        ".cmp-tire-search__image, .cmp-tire-search-v2-size-selector__tire-search-image img, .cmp-tire-search-by-vehicle-step__image img, img"
      );
    } else if (isProductHeroTeaser) {
      textCell = [];
      const name = element.querySelector(".cmp-product-hero-teaser__name h1, .cmp-product-hero-teaser__name h2, .cmp-product-hero-teaser__name h3, .cmp-product-hero-teaser__name h4, .cmp-product-hero-teaser__name h5, .cmp-product-hero-teaser__name .cmp-title__text");
      const desc = element.querySelector(".cmp-product-hero-teaser__description h1, .cmp-product-hero-teaser__description h2, .cmp-product-hero-teaser__description h3, .cmp-product-hero-teaser__description h4, .cmp-product-hero-teaser__description h5, .cmp-product-hero-teaser__description .cmp-title__text");
      const bestSelling = element.querySelector(".cmp-product-hero-teaser__best-selling");
      const cta = element.querySelector(".cmp-product-hero-teaser__content a, .button a, a");
      if (bestSelling) textCell.push(bestSelling);
      if (name) textCell.push(name);
      if (desc) textCell.push(desc);
      if (cta) textCell.push(cta);
      image = element.querySelector(".cmp-product-hero-teaser__productimage, .cmp-product-hero-teaser__image, img");
    } else {
      const textCol = element.querySelector(".text .cmp-text, .cmp-text, .text");
      textCell = [];
      if (textCol) {
        Array.from(textCol.children).forEach((child) => textCell.push(child));
        if (textCell.length === 0) textCell.push(textCol);
      }
      image = element.querySelector(".image img, .cmp-image img, img");
    }
    const hasText = Array.isArray(textCell) && textCell.some((node) => node && (node.textContent || "").trim().length > 0);
    const hasImage = !!(image && (image.getAttribute("src") || ((_a = image.querySelector) == null ? void 0 : _a.call(image, "img"))));
    if (!hasText && !hasImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[hasText ? textCell : "", hasImage ? image : ""]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-story.js
  function parse4(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-image-list__item"));
    const cells = [];
    items.forEach((item) => {
      var _a, _b, _c;
      const href = ((_a = item.querySelector(".cmp-image-list__item-image-link")) == null ? void 0 : _a.getAttribute("href")) || ((_b = item.querySelector("a")) == null ? void 0 : _b.getAttribute("href")) || "";
      const img = item.querySelector(".cmp-image-list__item-image img, img");
      const date = item.querySelector(".cmp-image-list__item-date");
      const titleText = (((_c = item.querySelector(".cmp-image-list__item-title")) == null ? void 0 : _c.textContent) || "").trim();
      const description = item.querySelector(".cmp-image-list__item-description");
      if (!titleText && !img) return;
      const body = [];
      if (date) {
        const p = document.createElement("p");
        p.textContent = (date.textContent || "").trim();
        body.push(p);
      }
      if (titleText) {
        const h3 = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleText;
          h3.append(a);
        } else {
          h3.textContent = titleText;
        }
        body.push(h3);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = (description.textContent || "").trim();
        body.push(p);
      }
      if (href) {
        const readMore = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = "Read more";
        readMore.append(a);
        body.push(readMore);
      }
      cells.push([img || "", body]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse5(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-image-list__item"));
    const cells = [];
    items.forEach((item) => {
      var _a, _b, _c;
      const href = ((_a = item.querySelector(".cmp-image-list__item-image-link")) == null ? void 0 : _a.getAttribute("href")) || ((_b = item.querySelector("a")) == null ? void 0 : _b.getAttribute("href")) || "";
      const img = item.querySelector(".cmp-image-list__item-image img, img");
      const date = item.querySelector(".cmp-image-list__item-date");
      const titleText = (((_c = item.querySelector(".cmp-image-list__item-title")) == null ? void 0 : _c.textContent) || "").trim();
      const description = item.querySelector(".cmp-image-list__item-description");
      if (!titleText && !img) return;
      const body = [];
      if (date && (date.textContent || "").trim()) {
        const p = document.createElement("p");
        p.textContent = (date.textContent || "").trim();
        body.push(p);
      }
      if (titleText) {
        const h3 = document.createElement("h3");
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleText;
          h3.append(a);
        } else {
          h3.textContent = titleText;
        }
        body.push(h3);
      }
      if (description && (description.textContent || "").trim()) {
        const p = document.createElement("p");
        p.textContent = (description.textContent || "").trim();
        body.push(p);
      }
      if (href) {
        const readMore = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = "Read more";
        readMore.append(a);
        body.push(readMore);
      }
      cells.push([img || "", body]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/region-selector.js
  function parse6(element, { document }) {
    const heading = element.querySelector(".cmp-user-guidance-inpage > h2, h2");
    const placeholderEl = element.querySelector(".dropdown__filter-selected");
    const placeholderText = placeholderEl ? (placeholderEl.textContent || "").trim() : "";
    const optionEls = Array.from(element.querySelectorAll(".dropdown__select-option"));
    const cells = [];
    if (placeholderText) cells.push([placeholderText]);
    optionEls.forEach((opt) => {
      const label = (opt.textContent || "").trim();
      if (!label) return;
      cells.push([label, ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "region-selector", cells });
    if (heading) {
      element.replaceWith(heading, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/conti-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // accessiBe accessibility widget (body-level, injected at runtime).
        // Verified: <span class="acsb-sr-alert acsb-sr-only">, <access-widget-ui>,
        // <a class="acsb-sr-only">, <div class="acsb-trigger acsb-widget">.
        ".acsb-sr-alert",
        ".acsb-sr-only",
        ".acsb-widget",
        ".acsb-trigger",
        "access-widget-ui",
        // consentmanager cookie-consent container.
        // Verified: <div id="cmpwrapper" class="cmpwrapper focus-visible">.
        "#cmpwrapper",
        // Geo / country top-banner ("You are currently on our Global ... website").
        // Verified: <div class="user-guidance ..."> wrapping <header class="cmp-user-guidance">.
        // NOTE: token is exactly `user-guidance`; the in-content `user-guidance-inpage`
        // block is a DIFFERENT token inside <main> and is intentionally NOT matched.
        ".user-guidance"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Header / primary navigation — experience-fragment chrome (migrated separately).
        // Verified: <header class="dynamicexperiencefragment experiencefragment ...">.
        // Tag-scoped to <header>/<footer> so it can NEVER match the authorable
        // `div.experiencefragment` that lives INSIDE <main> (e.g. the car-landing
        // wrapper around the carousel-gateway block).
        "header.dynamicexperiencefragment",
        // Footer — experience-fragment chrome (migrated separately).
        // Verified: <footer class="dynamicexperiencefragment experiencefragment ...">.
        "footer.dynamicexperiencefragment",
        // Breadcrumbs (non-authorable, rendered by the shell above/below <main>).
        // Verified: <div class="breadcrumb aem-GridColumn ..."> and
        // <div class="breadcrumb grey-background aem-GridColumn ...">.
        ".breadcrumb",
        // Global loading indicator (runtime chrome, sibling after footer).
        // Verified: <div class="cmp-global-loading-indicator">.
        ".cmp-global-loading-indicator"
      ]);
    }
  }

  // tools/importer/import-conti.js
  var parsers = {
    "hero-welcome": parse,
    "carousel-gateway": parse2,
    "columns-teaser": parse3,
    "cards-story": parse4,
    "cards-feature": parse5,
    "region-selector": parse6
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATES = [
    {
      name: "homepage",
      urls: ["https://www.continental-tires.com"],
      blocks: [
        { name: "hero-welcome", instances: ["main .stage-image.teaser"] },
        { name: "carousel-gateway", instances: ["main .product-area-gateway"] },
        { name: "region-selector", instances: ["main .container:nth-of-type(4)"] },
        {
          name: "columns-teaser",
          instances: [
            "main .container:nth-of-type(8)",
            "main .container:nth-of-type(10)",
            "main .container:nth-of-type(12)"
          ]
        },
        { name: "cards-story", instances: ["main .container:nth-of-type(13)"] }
      ]
    },
    {
      name: "car-landing",
      urls: ["https://www.continental-tires.com/products/car/"],
      blocks: [
        { name: "hero-welcome", instances: ["main .stage-image.teaser"] },
        {
          name: "cards-feature",
          instances: ["main .image-list.image-list--a", "main .image-list.image-list--d"]
        },
        { name: "carousel-gateway", instances: ["main .product-highlighting-cards"] },
        { name: "columns-teaser", instances: ["main .product-hero-teaser"] },
        { name: "cards-story", instances: ["main .image-list.image-list--e"] }
      ]
    },
    {
      name: "product-search",
      urls: ["https://www.continental-tires.com/products/car/product-search/"],
      blocks: [
        { name: "columns-teaser", instances: ["main .tiresearch"] }
      ]
    },
    {
      name: "search-by-size",
      urls: ["https://www.continental-tires.com/products/car/product-search/search-by-size/"],
      blocks: [
        { name: "columns-teaser", instances: ["main .tiresearchbysize"] }
      ]
    },
    {
      name: "search-by-vehicle",
      urls: ["https://www.continental-tires.com/products/car/product-search/search-by-vehicle/"],
      blocks: [
        { name: "columns-teaser", instances: ["main .tiresearchbyvehicle"] }
      ]
    }
  ];
  function normalizePath(u) {
    try {
      return new URL(u).pathname.replace(/\/+$/, "") || "/";
    } catch (e) {
      return u;
    }
  }
  function selectTemplate(url) {
    const path = normalizePath(url);
    return PAGE_TEMPLATES.find((t) => t.urls.some((u) => normalizePath(u) === path)) || null;
  }
  function executeTransformers(hookName, element, payload, template) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
  var import_conti_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      const sourceUrl = params && params.originalURL || url;
      const template = selectTemplate(sourceUrl);
      if (!template) {
        console.warn(`No standard template matched for ${sourceUrl} \u2014 applying cleanup only.`);
      }
      executeTransformers("beforeTransform", main, payload, template);
      if (template) {
        const pageBlocks = findBlocksOnPage(document, template);
        pageBlocks.forEach((block) => {
          if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload, template);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, sourceUrl);
      const rawPath = normalizePath(sourceUrl).replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(
        rawPath === "" || rawPath === "/" ? "/index" : `${rawPath}/index`
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: template ? template.name : "unmatched",
          blocks: template ? template.blocks.map((b) => b.name) : []
        }
      }];
    }
  };
  return __toCommonJS(import_conti_exports);
})();
