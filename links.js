/**
 * =============================================================
 *  CENTRAL LINK & ASSET CONFIG
 * =============================================================
 *  Edit this file ONLY to add your real links and files.
 *  Every button/link on the site that depends on an external
 *  resource reads from here — you never need to touch index.html.
 *
 *  HOW TO USE
 *  - Replace any string starting with "LINK_PLACEHOLDER_" with
 *    your real URL.
 *  - Leave a value as `null` if it does not exist yet. The
 *    element for it will stay hidden instead of showing a
 *    broken/empty link (any element marked data-hide-if-empty).
 * =============================================================
 */

const SITE_LINKS = {

  // ---- Personal ----
  // No CV file has been supplied yet — the Download CV button stays
  // hidden until you set this to a real path (e.g. "assets/cv.pdf")
  // or URL.
  cv: null,
  linkedin: "https://linkedin.com/in/aryam-alsaidi",
  email: "ariam.gis@outlook.com",

  // ---- Project 01 — Academic Research (Dammam Industrial Cities, 2000–2025) ----
  // This project has no external report link of its own — the original
  // research report is linked ONLY from the IDRM section below (idrm.reportUrl),
  // per your instruction not to expose it as a standalone project asset.
  academic: {},

  // ---- Project 01A — Independent Extension: IDRM ----
  idrm: {
    // Power BI dashboard — verified against the report (Section 6.7.6), same
    // link is used for both the "Open Dashboard" button and any future embed.
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiZGRiNzQzYzgtNGRiNS00MTQxLWEyNWQtZGY5ZWE3YzMyZmU4IiwidCI6IjUxNGZhYTE5LThjODQtNGNlZi04YWU5LTJiOWRiY2U5MzNjZCIsImMiOjl9",

    // Original IDRM research report (PDF), hosted directly in this GitHub repository
    // and opened on its own — it is NOT embedded anywhere in the portfolio.
    // This is the file's GitHub URL (owner / repo / branch / path). If you ever
    // rename or move the PDF in the repo, update this one line.
    // This link appears ONLY inside the IDRM section.
    reportUrl: "https://github.com/Ariamibra/IDRM-Original-Research/blob/main/IDRM_Research_Report.pdf"
  },

  // ---- Project 02 — Wejhatna (Tuwaiq Riyadh hackathon) ----
  // Both links below already existed in your source file and are preserved as-is.
  wejhatna: {
    githubUrl: "https://github.com/norasaleh1/Wejhatna",
    demoUrl: "https://wejhatna.vercel.app"
  },

  // ---- Contact form (Formspree) ----
  // Existing Formspree endpoint (no new form or account was created). It is applied
  // to the contact form's action attribute below (the same URL is also written into
  // the form in index.html as a no-JavaScript fallback).
  formspreeEndpoint: "https://formspree.io/f/mdavedkn"
};

// Do not edit below this line — this wires the config above to the page.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-link]').forEach(el => {
    const path = el.getAttribute('data-link').split('.');
    let value = SITE_LINKS;
    for (const key of path) value = value ? value[key] : undefined;

    const isPlaceholder = typeof value === 'string' && value.startsWith('LINK_PLACEHOLDER_');

    if (!value || isPlaceholder) {
      if (el.hasAttribute('data-hide-if-empty')) {
        el.setAttribute('hidden', '');
      } else {
        el.setAttribute('data-state', 'soon');
        el.setAttribute('aria-disabled', 'true');
      }
      return;
    }

    if (el.tagName === 'A') {
      const prefix = el.getAttribute('data-href-prefix') || '';
      el.setAttribute('href', prefix + value);
    } else if (el.tagName === 'FORM') {
      el.setAttribute('action', value);
    } else if (el.tagName === 'IMG' || el.tagName === 'IFRAME') {
      el.setAttribute('src', value);
    }
  });
});
