/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Continental (conti) site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. Reused across every standard-content template
 * (homepage, car-landing, product-search, search-by-size, search-by-vehicle).
 *
 * The transform root is `document.body` (the importer/validator call
 * `transform(hook, document.body, payload)`), so all of the chrome below —
 * which lives OUTSIDE `<main>` as body/grid siblings — is reachable and
 * targetable. Because every removed element is a sibling of `<main>` (never a
 * descendant), removals do not shift the `main .container:nth-of-type(N)`
 * positional selectors the block parsers rely on.
 *
 * ⚠️ ALL selectors below were verified against the captured DOM in
 * migration-work/pages/<template>/cleaned.html (present and consistent on all
 * five standard pages). None are guessed.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    WebImporter.DOMUtils.remove(element, [
      // accessiBe accessibility widget (body-level, injected at runtime).
      // Verified: <span class="acsb-sr-alert acsb-sr-only">, <access-widget-ui>,
      // <a class="acsb-sr-only">, <div class="acsb-trigger acsb-widget">.
      '.acsb-sr-alert',
      '.acsb-sr-only',
      '.acsb-widget',
      '.acsb-trigger',
      'access-widget-ui',
      // consentmanager cookie-consent container.
      // Verified: <div id="cmpwrapper" class="cmpwrapper focus-visible">.
      '#cmpwrapper',
      // Geo / country top-banner ("You are currently on our Global ... website").
      // Verified: <div class="user-guidance ..."> wrapping <header class="cmp-user-guidance">.
      // NOTE: token is exactly `user-guidance`; the in-content `user-guidance-inpage`
      // block is a DIFFERENT token inside <main> and is intentionally NOT matched.
      '.user-guidance',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      // Header / primary navigation — experience-fragment chrome (migrated separately).
      // Verified: <header class="dynamicexperiencefragment experiencefragment ...">.
      // Tag-scoped to <header>/<footer> so it can NEVER match the authorable
      // `div.experiencefragment` that lives INSIDE <main> (e.g. the car-landing
      // wrapper around the carousel-gateway block).
      'header.dynamicexperiencefragment',
      // Footer — experience-fragment chrome (migrated separately).
      // Verified: <footer class="dynamicexperiencefragment experiencefragment ...">.
      'footer.dynamicexperiencefragment',
      // Breadcrumbs (non-authorable, rendered by the shell above/below <main>).
      // Verified: <div class="breadcrumb aem-GridColumn ..."> and
      // <div class="breadcrumb grey-background aem-GridColumn ...">.
      '.breadcrumb',
      // Global loading indicator (runtime chrome, sibling after footer).
      // Verified: <div class="cmp-global-loading-indicator">.
      '.cmp-global-loading-indicator',
    ]);
  }
}
