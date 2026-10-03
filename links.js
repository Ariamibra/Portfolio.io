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
    cv: "https://drive.google.com/file/d/1bGA7Jd8187VHtHZ8vpipei_GqXDKpCjs/view?usp=drivesdk",
  linkedin: "https://linkedin.com/in/aryam-alsaidi",
  email: "ariam.gis@outlook.com",
  // GitHub profile: the GitHub contact row stays hidden until you set this (e.g. "https://github.com/your-username").
  github: null,

  // ---- Project 01 — Academic Research (Dammam Industrial Cities, 2000–2025) ----
  // This project has no external report link of its own — the original
  // research report is linked ONLY from the IDRM section below (idrm.reportUrl),
  // per your instruction not to expose it as a standalone project asset.
  academic: {
    reportUrl: "https://drive.google.com/file/d/1XBqGBsd9dygiisrgAcK9uLWhmtNHXc5M/view?usp=drivesdk"
  },

  // ---- Project 01A — Independent Extension: IDRM ----
  idrm: {
    // Power BI dashboard — verified against the report (Section 6.7.6), same
    // link is used for both the "Open Dashboard" button and any future embed.
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiZGRiNzQzYzgtNGRiNS00MTQxLWEyNWQtZGY5ZWE3YzMyZmU4IiwidCI6IjUxNGZhYTE5LThjODQtNGNlZi04YWU5LTJiOWRiY2U5MzNjZCIsImMiOjl9",

    // IDRM project report. This link appears inside the IDRM section.
    reportUrl: "https://drive.google.com/file/d/1eFFNf-au-tk1qPD_UeoBSmX50wLnbjAo/view?usp=drivesdk"
  },

  // ---- Project 02 — Wejhatna (Tuwaiq Riyadh program) ----
  // Both links below already existed in your source file and are preserved as-is.
  wejhatna: {
    liveUrl: "https://wejhatna.onrender.com/",
    githubUrl: "https://github.com/norasaleh1/Wejhatna",
    reportUrl: "https://drive.google.com/file/d/1sJY5zC95-GsuiG1kcKY47JlHkEzapDjB/view?usp=drivesdk"
  },

  // ---- Academic recommendations ----
  recommendations: {
    hajarUrl: "https://drive.google.com/file/d/1wGm8l7CaN4Wt-pyYrMhVorhlG7WKb3Ba/view?usp=drivesdk",
    afafUrl: "https://drive.google.com/file/d/1_JjJQO7uHYmcWHhNtbmOenxBNQlT4TkT/view?usp=drivesdk"
  },

  // ---- Certificates (exact URLs) ----
  certificates: {
    esri: "https://www.esri.com/training/TrainingRecord/Certificate/Aryaibra/68396146f1f89ab68f746839/-180",
    google: "https://www.coursera.org/account/accomplishments/specialization/AUT28Z1HYYQQ",
    satr: "https://assets.safcsp.cloud/public/certificates/7463173c-6bb8-4951-8a23-67a463fabf04/1765196995_f1340f32-9179-4790-86a1-e618487cb7dc.png",
    ibm: "https://www.credly.com/badges/10d82d82-a194-4daf-9b61-92ff0c63b074/linked_in_profile",
    sdaiaPrinciples: "https://learn.samai.futurex.sa/mod/customcert/verify_certificate.php?code=AOaf66H5aE&qrcode=1",
    sdaiaAdvanced: "https://learn.samai.futurex.sa/mod/customcert/view.php?id=567&downloadown=1"
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

    if (el.hasAttribute('data-hide-if-empty')) el.removeAttribute('hidden');
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
