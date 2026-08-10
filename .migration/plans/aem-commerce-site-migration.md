Plan approved. Let me enable the commerce migration plugin.# Continental Tires — Multi-Page Migration to AEM Edge Delivery Services

> **⚠️ Action needed: switch to Execute mode.** The plan is approved and ready to run, but the session is still in **Plan mode**, which blocks all writes — including creating `.agents/settings.json` to enable the commerce plugin and running the import. I attempted to write the settings file and it was blocked. Please exit Plan mode (Execute mode), and I'll immediately: (1) write `.agents/settings.json` to enable the commerce plugin, then (2) after the session reinitializes on your next message, begin the migration starting with Phase 1.

## Overview

Migrate 6 pages from **continental-tires.com** into this AEM Edge Delivery Services project (commerce boilerplate). The project is already scaffolded (org `haug124`, repo `conti`, Document Authoring content source at `content.da.live/haug124/conti/`). Several of the target pages are product **search / listing** experiences, so the commerce migration workflow will be enabled to classify each URL correctly (commerce PDP/PLP vs. standard content) and route it to the right implementation path.

Two pages (**search-by-size** and **search-by-vehicle**) contain forms. Per your direction, forms will be migrated as **static content** (rendered markup only) — the AEM Forms/Adaptive Forms tooling will **not** be enabled, so these forms won't be wired to a form backend or become functional Adaptive Forms.

## Target Pages

| # | URL | Likely type | Forms |
|---|-----|-------------|-------|
| 1 | `https://www.continental-tires.com` | Homepage (standard content) | — |
| 2 | `/products/car/` | Category / landing (standard or PLP) | — |
| 3 | `/products/car/product-search/` | Product search (commerce PLP candidate) | — |
| 4 | `/products/car/search-results/` | Search results (commerce PLP candidate) | — |
| 5 | `/products/car/product-search/search-by-size/` | Search-by-size (commerce PLP candidate) | ✅ static |
| 6 | `/products/car/product-search/search-by-vehicle/` | Search-by-vehicle (commerce PLP candidate) | ✅ static |

Classification is confirmed during analysis (Phase 2), not assumed here.

## Approach

1. **Enable the commerce migration plugin** so product-search/listing pages are detected and routed correctly. This takes effect on the next message (the session auto-reinitializes between turns).
2. **Analyze** each page's structure, sections, and content sequences; **classify** commerce vs. standard.
3. **Catalog blocks** — reuse existing boilerplate blocks where possible; create new block variants only where the source design requires it.
4. **Build import infrastructure** (page templates, block parsers, page transformers) and an **import script**.
5. **Run the bulk import** to generate content into the Document Authoring content source (never hand-authored HTML).
6. **Validate** rendered output against the originals in preview and fix divergences.

## Execution Readiness

- **Blocker:** writes are disabled in Plan mode. Switch to **Execute mode** to proceed.
- **First action on Execute:** write `/backups/haug124/conti/repo/.agents/settings.json` with `{"enabledPlugins": {"excat-commerce@excat-extended": true}}` (the `.agents/` directory does not yet exist and will be created). I will confirm and stop so the session reinitializes.
- **Second action (your next message after that):** the commerce migration skills load; begin Phase 1 → Phase 6.

## Assumptions & Constraints

- Content is generated only via the project's bundled import script + the bulk-import tooling — no manual HTML authoring.
- **Forms are static:** the AEM Forms migration tooling stays disabled; forms on the search-by-size and search-by-vehicle pages are migrated as static markup and are not functional Adaptive Forms. Making them interactive would be a separate follow-up requiring the forms plugin.
- Commerce PDP/PLP pages that depend on the Adobe Commerce backend (`config.json` endpoint) will be migrated as their EDS page/block structure; live product data comes from the commerce endpoint, not scraped content.
- Header (navigation) and footer are shared site chrome and may be migrated as a follow-up if in scope.
- Migration artifacts live under `.migration/` and `migration-work/`; content lands in the Document Authoring source.

## Open Questions (resolve during execution)

- Whether pages 3–6 should be true commerce PLP blocks (backed by the commerce endpoint) or static content replicas of the search UI — decided per-page after Phase 2 classification.
- Whether header/nav and footer migration are in scope for this pass.

## Checklist

### Phase 0 — Enable tooling
- [ ] **(Execute mode)** Create `.agents/settings.json` with `"excat-commerce@excat-extended": true` to enable the commerce migration workflow (takes effect next turn)
- [ ] Leave the forms migration plugin **disabled** (forms handled as static content per user decision)
- [ ] Confirm the commerce migration skills are available after reinit

### Phase 1 — Setup & baseline
- [ ] Confirm dev server runs at `localhost:3000` (`aem up`) and renders existing content
- [ ] Confirm org/repo/content-source (`haug124` / `conti` / `content.da.live/haug124/conti`) and target content paths for the 6 pages

### Phase 2 — Per-page analysis & classification
- [ ] Scrape each of the 6 source pages (content, metadata, images, cleaned HTML)
- [ ] Classify each URL: commerce (PDP/PLP) vs. standard content
- [ ] Identify sections and content sequences per page
- [ ] Flag form regions on search-by-size and search-by-vehicle for static capture (structure + labels preserved, no backend wiring)
- [ ] Group pages into page templates where structures repeat

### Phase 3 — Block inventory & design
- [ ] Inventory existing boilerplate/Block Collection blocks and map source sections to them
- [ ] Design/create new block variants only where no existing block fits
- [ ] Extract and apply design (styles/CSS) to match the source visually

### Phase 4 — Import infrastructure
- [ ] Generate page templates (with block mappings) for the identified templates
- [ ] Generate block parsers for each block variant
- [ ] Generate page transformers (cleanup, sections, media handling)
- [ ] Assemble and bundle the import script

### Phase 5 — Import execution
- [ ] Run the bulk import for the 6 URLs into the Document Authoring content source
- [ ] Verify content files were created at the expected paths

### Phase 6 — Validation & QA
- [ ] Preview each imported page and compare against the original (content completeness + visual critique)
- [ ] Confirm the static forms render correctly (layout/labels intact) on both form pages
- [ ] Fix rendering/styling/structure divergences
- [ ] Run `npm run lint` and confirm clean
- [ ] Report per-page migration status and any items needing author/commerce-backend follow-up

### Phase 7 — Follow-ups (optional / confirm scope)
- [ ] Header/navigation migration (if in scope)
- [ ] Footer migration (if in scope)
- [ ] (Optional) Convert the static forms to functional Adaptive Forms — requires enabling the forms migration plugin later
- [ ] Publish/preview to feature environment and open PR with demo links
