/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/commerce-import.js
  var commerce_import_exports = {};
  __export(commerce_import_exports, {
    default: () => commerce_import_default
  });
  function parseResultsHeading(document) {
    const heads = document.querySelectorAll(".cmp-tire-search-results-v2-results__title .cmp-title__text, h1.cmp-title__text, h5.cmp-title__text");
    if (!heads || heads.length === 0) {
      console.warn("\u26A0\uFE0F parseResultsHeading: no results heading found");
      return null;
    }
    const holder = document.createElement("div");
    const seen = /* @__PURE__ */ new Set();
    heads.forEach((h) => {
      const key = `${h.tagName}:${(h.textContent || "").trim()}`;
      if (seen.has(key)) return;
      seen.add(key);
      holder.append(h.cloneNode(true));
    });
    return holder.childNodes.length ? holder : null;
  }
  function buildProductListPageBlock(document) {
    const selectedPlpBlock = "product-list-page";
    const urlpath = "car";
    const pageSize = "9";
    return WebImporter.DOMUtils.createTable([
      [selectedPlpBlock],
      ["urlpath", urlpath],
      ["pageSize", pageSize]
    ], document);
  }
  var commerce_import_default = {
    transform({ document, url, params }) {
      const main = document.body;
      const resultsHeading = parseResultsHeading(document);
      const productListPageBlock = buildProductListPageBlock(document);
      main.innerHTML = "";
      if (resultsHeading) {
        const headingSection = document.createElement("div");
        headingSection.append(resultsHeading);
        main.append(headingSection);
        main.append(document.createElement("hr"));
      }
      const listingSection = document.createElement("div");
      listingSection.append(productListPageBlock);
      main.append(listingSection);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.adjustImageUrls(main, url, (params == null ? void 0 : params.originalURL) || url);
      const rawPath = new URL(url).pathname.replace(/\.html?$/i, "").replace(/\/+$/, "") || "/";
      return [{ element: main, path: WebImporter.FileUtils.sanitizePath(rawPath) }];
    }
  };
  return __toCommonJS(commerce_import_exports);
})();
